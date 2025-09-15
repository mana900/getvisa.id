import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    const { data: leads, error } = await supabase
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact leads for export:', error)
      return NextResponse.json(
        { error: 'Failed to fetch contact leads' },
        { status: 500 }
      )
    }

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'ID',
        'Date Created',
        'Name',
        'Phone',
        'Country',
        'Visa Type',
        'Visa ID',
        'Price (IDR)',
        'Source',
        'WhatsApp Clicked',
        'WhatsApp Date',
        'Last Updated'
      ]

      const csvRows = [
        headers.join(','),
        ...leads.map(lead => [
          lead.id,
          `"${formatDateForExport(lead.created_at)}"`,
          `"${lead.name.replace(/"/g, '""')}"`,
          `"${lead.phone}"`,
          `"${lead.country.replace(/"/g, '""')}"`,
          `"${lead.visa_type.replace(/"/g, '""')}"`,
          `"${lead.visa_id || ''}"`,
          lead.price || '',
          `"${lead.source.replace(/"/g, '""')}"`,
          lead.whatsapp_clicked ? 'Yes' : 'No',
          lead.whatsapp_clicked_at ? `"${formatDateForExport(lead.whatsapp_clicked_at)}"` : '',
          `"${formatDateForExport(lead.updated_at)}"`
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `contact-leads-${timestamp}.csv`

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    return NextResponse.json(
      { error: 'Unsupported export format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in contact leads export:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatDateForExport(dateString: string): string {
  const date = new Date(dateString)
  return date.toISOString().replace('T', ' ').substring(0, 19)
}
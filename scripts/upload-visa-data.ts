import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aokgasdirwpexlwequkq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFva2dhc2RpcndwZXhsd2VxdWtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjEzNDc1MiwiZXhwIjoyMDcxNzEwNzUyfQ.8Q11ZF5aXY7er2xlibAcG4xFERKXZnw29--SaAKnP4A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Country flag mapping - using emoji flags
const countryFlags: Record<string, string> = {
  'CANADA': '🇨🇦',
  'AUSTRALIA': '🇦🇺',
  'CHINA': '🇨🇳',
  'DUBAI': '🇦🇪',
  'SINGAPORE': '🇸🇬',
  'MALAYSIA': '🇲🇾',
  'PORTUGAL': '🇵🇹',
  'UK': '🇬🇧',
  'JAPAN': '🇯🇵',
  'JAPAN WAIVER (Indonesia Epassport)': '🇯🇵',
  'INDIA': '🇮🇳',
  'USA': '🇺🇸',
  'VIETNAM': '🇻🇳',
  'NETHERLANDS': '🇳🇱',
  'SOUTH AFRICA': '🇿🇦',
  'KENYA': '🇰🇪',
  'SOUTH KOREA': '🇰🇷',
  'NEW ZEALAND': '🇳🇿',
  'INBOUND (VISA ON ARRIVAL)': '🇮🇩',
  'FRANCE': '🇫🇷',
  'GERMANY': '🇩🇪',
  'SPAIN': '🇪🇸',
  'DENMARK': '🇩🇰',
  'SWITZERLAND': '🇨🇭',
  'ITALY': '🇮🇹',
  'TURKEY': '🇹🇷'
};

// Country code mapping 
const countryCodes: Record<string, string> = {
  'CANADA': 'CA',
  'AUSTRALIA': 'AU', 
  'CHINA': 'CN',
  'DUBAI': 'AE',
  'SINGAPORE': 'SG',
  'MALAYSIA': 'MY',
  'PORTUGAL': 'PT',
  'UK': 'GB',
  'JAPAN': 'JP',
  'JAPAN WAIVER (Indonesia Epassport)': 'JP',
  'INDIA': 'IN',
  'USA': 'US',
  'VIETNAM': 'VN',
  'NETHERLANDS': 'NL',
  'SOUTH AFRICA': 'ZA',
  'KENYA': 'KE',
  'SOUTH KOREA': 'KR',
  'NEW ZEALAND': 'NZ',
  'INBOUND (VISA ON ARRIVAL)': 'ID',
  'FRANCE': 'FR',
  'GERMANY': 'DE',
  'SPAIN': 'ES',
  'DENMARK': 'DK',
  'SWITZERLAND': 'CH',
  'ITALY': 'IT',
  'TURKEY': 'TR'
};

interface ParsedVisa {
  country: string;
  country_code: string;
  flag: string;
  visa_type: string;
  price: number;
  processing_time: string;
  duration: string;
  validity: string;
  is_active: boolean;
  overview: any;
  eligibility: string[];
  timeline: any[];
  documents: string[];
  faqs: any[];
}

function parseMarkdownContent(content: string): ParsedVisa[] {
  const visas: ParsedVisa[] = [];
  const sections = content.split('---').filter(section => section.trim());
  
  for (const section of sections) {
    if (!section.includes('Country:')) continue;
    
    const lines = section.split('\n').map(line => line.trim()).filter(line => line);
    const visaData: any = {
      is_active: true,
      overview: {},
      eligibility: [],
      timeline: [],
      documents: [],
      faqs: []
    };

    let currentSection = '';
    let requirementsList: string[] = [];
    let stepsList: any[] = [];
    let faqsList: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('Country:')) {
        const country = line.replace('Country:', '').trim();
        visaData.country = country;
        visaData.country_code = countryCodes[country] || 'XX';
        visaData.flag = countryFlags[country] || '🏳️';
      } else if (line.startsWith('Visa name:')) {
        visaData.visa_type = line.replace('Visa name:', '').trim() || 'Standard Visa';
      } else if (line.startsWith('Price:')) {
        const priceText = line.replace('Price:', '').trim();
        // Extract numeric value from price text
        const priceMatch = priceText.match(/Rp\.?\s*([\d,\.]+)/i) || priceText.match(/([\d,\.]+)/);
        if (priceMatch) {
          visaData.price = parseFloat(priceMatch[1].replace(/,/g, ''));
        } else {
          visaData.price = 0;
        }
      } else if (line.startsWith('Processing Time:')) {
        visaData.processing_time = line.replace('Processing Time:', '').trim();
      } else if (line.startsWith('Visa Validity:')) {
        visaData.validity = line.replace('Visa Validity:', '').trim();
      } else if (line.startsWith('Description:')) {
        visaData.overview.description = line.replace('Description:', '').trim();
        currentSection = 'description';
      } else if (line.startsWith('Key features:')) {
        currentSection = 'features';
        visaData.overview.key_features = [];
      } else if (line.startsWith('Guaranteed days to completion:')) {
        visaData.duration = line.replace('Guaranteed days to completion:', '').trim();
      } else if (line.startsWith('Eligibility-') || line.startsWith('Requirements:')) {
        currentSection = 'requirements';
        requirementsList = [];
      } else if (line.startsWith('Application Steps:')) {
        currentSection = 'steps';
        stepsList = [];
      } else if (line.startsWith('FAQ')) {
        currentSection = 'faq';
        faqsList = [];
      } else if (line.startsWith('**Q:**')) {
        const question = line.replace('**Q:**', '').trim();
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        const answer = nextLine.startsWith('**A:**') ? nextLine.replace('**A:**', '').trim() : '';
        if (question && answer) {
          faqsList.push({ question, answer });
          i++; // Skip the answer line
        }
      } else if (currentSection === 'requirements' && line.match(/^\d+\./)) {
        requirementsList.push(line);
      } else if (currentSection === 'steps' && line.includes(' / ')) {
        const parts = line.split(' / ');
        if (parts.length >= 3) {
          const stepName = parts[0].replace(/^-\s*/, '').trim();
          const timeRequired = parts[1].trim();
          const description = parts.slice(2).join(' / ').trim();
          stepsList.push({
            step: stepName,
            time_required: timeRequired,
            description: description
          });
        }
      } else if (currentSection === 'features' && line.startsWith('-')) {
        if (!visaData.overview.key_features) visaData.overview.key_features = [];
        visaData.overview.key_features.push(line.replace('-', '').trim());
      }
    }

    // Process duration/validity
    visaData.duration = visaData.duration || 'TBD';
    visaData.validity = visaData.validity || 'TBD';

    // Set eligibility and documents
    visaData.eligibility = requirementsList;
    visaData.documents = requirementsList; // Same as eligibility for now
    visaData.timeline = stepsList;
    visaData.faqs = faqsList;

    if (visaData.country && visaData.visa_type) {
      visas.push(visaData as ParsedVisa);
    }
  }

  return visas;
}

async function uploadVisaData() {
  try {
    console.log('📖 Reading visa data file...');
    const filePath = path.join(process.cwd(), 'getvisa_visas.md');
    const content = fs.readFileSync(filePath, 'utf-8');

    console.log('🔍 Parsing visa data...');
    const visas = parseMarkdownContent(content);
    console.log(`✅ Parsed ${visas.length} visa entries`);

    console.log('🗑️ Clearing existing visa data...');
    const { error: deleteError } = await supabase
      .from('visa_types')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('❌ Error clearing existing data:', deleteError);
    } else {
      console.log('✅ Cleared existing visa data');
    }

    console.log('📤 Uploading visa data to Supabase...');
    
    // Upload in batches of 10 to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < visas.length; i += batchSize) {
      const batch = visas.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('visa_types')
        .insert(batch);

      if (error) {
        console.error(`❌ Error uploading batch ${Math.floor(i/batchSize) + 1}:`, error);
        console.error('Failed records:', JSON.stringify(batch, null, 2));
      } else {
        console.log(`✅ Uploaded batch ${Math.floor(i/batchSize) + 1} (${batch.length} records)`);
      }
    }

    console.log('🎉 Visa data upload completed!');
    
    // Verify upload
    const { data: verifyData, error: verifyError } = await supabase
      .from('visa_types')
      .select('country, visa_type, price')
      .order('country');

    if (verifyError) {
      console.error('❌ Error verifying upload:', verifyError);
    } else {
      console.log(`✅ Verification: ${verifyData?.length} visa types in database`);
      verifyData?.forEach((visa: any) => {
        console.log(`   • ${visa.country} - ${visa.visa_type} (Rp. ${visa.price.toLocaleString()})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the upload
uploadVisaData();
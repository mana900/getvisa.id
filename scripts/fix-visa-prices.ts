import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aokgasdirwpexlwequkq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFva2dhc2RpcndwZXhsd2VxdWtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjEzNDc1MiwiZXhwIjoyMDcxNzEwNzUyfQ.8Q11ZF5aXY7er2xlibAcG4xFERKXZnw29--SaAKnP4A';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixVisaPrices() {
  try {
    console.log('🔧 Fixing visa pricing issues...');

    // Fix Dubai visa price - should be 2,100,000 for Emirates ticket
    console.log('📍 Fixing Dubai visa price...');
    const { data: dubaiUpdate, error: dubaiError } = await supabase
      .from('visa_types')
      .update({ price: 2100000 })
      .eq('country', 'DUBAI')
      .select();

    if (dubaiError) {
      console.error('❌ Error fixing Dubai price:', dubaiError);
    } else {
      console.log('✅ Fixed Dubai visa price:', dubaiUpdate);
    }

    // Fix Turkey visa price - should be 1,350,000
    console.log('📍 Fixing Turkey visa price...');  
    const { data: turkeyUpdate, error: turkeyError } = await supabase
      .from('visa_types')
      .update({ price: 1350000 })
      .eq('country', 'TURKEY')
      .select();

    if (turkeyError) {
      console.error('❌ Error fixing Turkey price:', turkeyError);
    } else {
      console.log('✅ Fixed Turkey visa price:', turkeyUpdate);
    }

    // Add missing Kenya visa with proper price - 995,000
    console.log('📍 Adding Kenya visa data...');
    const { data: kenyaData, error: kenyaFetchError } = await supabase
      .from('visa_types')
      .select('*')
      .eq('country', 'KENYA');

    if (kenyaFetchError) {
      console.error('❌ Error fetching Kenya data:', kenyaFetchError);
    } else if (kenyaData && kenyaData.length > 0) {
      // Kenya exists, update price
      const { data: kenyaUpdate, error: kenyaUpdateError } = await supabase
        .from('visa_types')
        .update({ price: 995000 })
        .eq('country', 'KENYA')
        .select();

      if (kenyaUpdateError) {
        console.error('❌ Error updating Kenya price:', kenyaUpdateError);
      } else {
        console.log('✅ Updated Kenya visa price:', kenyaUpdate);
      }
    } else {
      console.log('ℹ️ Kenya visa not found in database - it may not have been uploaded');
    }

    console.log('🎉 Price fixes completed!');
    
    // Verify the fixes
    console.log('🔍 Verifying price fixes...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('visa_types')
      .select('country, visa_type, price')
      .in('country', ['DUBAI', 'TURKEY', 'KENYA'])
      .order('country');

    if (verifyError) {
      console.error('❌ Error verifying fixes:', verifyError);
    } else {
      console.log('✅ Verification results:');
      verifyData?.forEach((visa: any) => {
        console.log(`   • ${visa.country}: Rp ${visa.price?.toLocaleString() || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the price fixes
fixVisaPrices();
/**
 * Supabase Connection Test Script
 * Run: npx ts-node scripts/test-connection.ts
 */

import { supabase, supabaseAdmin } from '../src/lib/db/client';

async function testConnection() {
  console.log('\n🔍 Testing Supabase Connection...\n');

  // Test 1: Basic connection
  try {
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Basic connection failed:', error.message);
      console.log('\n💡 Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
      return;
    }
    console.log('✅ Basic connection successful!\n');
  } catch (error) {
    console.error('❌ Connection error:', error);
    return;
  }

  // Test 2: List existing tables
  try {
    console.log('2️⃣ Checking existing tables...');
    const { data: tables, error } = await supabaseAdmin.rpc('get_public_tables', {});
    
    if (error) {
      console.log('⚠️  Could not list tables (expected if function not created)');
      console.log('   Trying direct query...\n');
      
      // Fallback: try to query known tables
      const tableChecks = [
        'users',
        'posts',
        'comments',
        'reactions',
        'follows',
        'subscriptions',
        'marketplace_items',
        'orders',
        'stories',
        'ai_usage_logs',
        'moderation_logs',
      ];

      console.log('📊 Table Status:\n');
      for (const table of tableChecks) {
        const { error } = await supabase.from(table).select('count').limit(1);
        console.log(`   ${error ? '❌' : '✅'} ${table}`);
      }
    } else {
      console.log('✅ Tables found:', tables);
    }
    console.log('');
  } catch (error) {
    console.log('⚠️  Could not check tables\n');
  }

  // Test 3: Auth check
  try {
    console.log('3️⃣ Testing auth configuration...');
    const { data: session, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('⚠️  Auth check failed:', error.message);
    } else {
      console.log('✅ Auth configuration OK (no active session)\n');
    }
  } catch (error) {
    console.log('⚠️  Auth test error\n');
  }

  // Test 4: Service role check
  try {
    console.log('4️⃣ Testing service role permissions...');
    const { data, error } = await supabaseAdmin.from('users').select('id').limit(1);
    
    if (error) {
      console.error('❌ Service role query failed:', error.message);
      console.log('\n💡 Check your SUPABASE_SERVICE_ROLE_KEY\n');
    } else {
      console.log('✅ Service role permissions OK\n');
    }
  } catch (error) {
    console.error('❌ Service role error\n');
  }

  console.log('\n🎉 Connection test complete!\n');
  console.log('Next steps:');
  console.log('1. Review which tables exist');
  console.log('2. Add missing tables from supabase/migrations/');
  console.log('3. Run: npm run dev\n');
}

// Add helper function to list tables (run in Supabase SQL editor first)
const createHelperFunction = `
-- Run this in Supabase SQL Editor to enable table listing:
CREATE OR REPLACE FUNCTION get_public_tables()
RETURNS TABLE(tablename name) AS $$
BEGIN
  RETURN QUERY
  SELECT t.tablename::name
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

console.log('\n📝 Optional: Run this in Supabase SQL Editor to enable table listing:\n');
console.log(createHelperFunction);
console.log('\n' + '='.repeat(60) + '\n');

testConnection().catch(console.error);

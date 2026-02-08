import { supabaseClient } from './src/services/supabase/index';

async function testSupabaseConnection() {
    console.log('Testing Supabase connection...\n');

    try {
        // Test 0: Check basic connectivity
        console.log('0. Checking basic connectivity...');
        const { data: healthCheck, error: healthError } = await supabaseClient
            .from('User')
            .select('*')
            .limit(0);
        
        console.log('Health check result:', { data: healthCheck, error: healthError });
        
        // Test 1: Check connection
        console.log('\n1. Testing connection...');
        const { data: testData, error: testError } = await supabaseClient
            .from('User')
            .select('count')
            .limit(1);
        
        if (testError) {
            console.error('❌ Connection failed:', testError.message);
            console.error('Error details:', testError);
            console.log('\n💡 Possible solutions:');
            console.log('   1. Make sure SUPABASE_KEY in .env is the service_role key (not anon key)');
            console.log('   2. Check if the User table exists in Supabase');
            console.log('   3. Disable RLS or add policies for the User table');
            return;
        }
        console.log('✅ Connection successful!\n');

        // Test 2: Insert a test user
        console.log('2. Inserting test user...');
        const testUser = {
            username: 'test_user_' + Date.now(),
            email: `test${Date.now()}@example.com`,
            role: 'user',
            credits: 0,
            freeCredits: 5
        };

        const { data: insertData, error: insertError } = await supabaseClient
            .from('User')
            .insert(testUser)
            .select();

        if (insertError) {
            console.error('❌ Insert failed:', insertError.message);
            return;
        }

        console.log('✅ User inserted successfully!');
        console.log('User data:', insertData);

        // Test 3: Query the user back
        if (insertData && insertData.length > 0) {
            const userId = insertData[0].id;
            console.log('\n3. Querying user back...');
            
            const { data: queryData, error: queryError } = await supabaseClient
                .from('User')
                .select('*')
                .eq('id', userId)
                .single();

            if (queryError) {
                console.error('❌ Query failed:', queryError.message);
                return;
            }

            console.log('✅ User queried successfully!');
            console.log('Queried user:', queryData);

            // Test 4: Clean up - delete test user
            console.log('\n4. Cleaning up test user...');
            const { error: deleteError } = await supabaseClient
                .from('User')
                .delete()
                .eq('id', userId);

            if (deleteError) {
                console.error('❌ Delete failed:', deleteError.message);
                console.log('⚠️  Please manually delete user with id:', userId);
                return;
            }

            console.log('✅ Test user deleted successfully!');
        }

        console.log('\n🎉 All tests passed! Supabase connection is working properly.');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

testSupabaseConnection();

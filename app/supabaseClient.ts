import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqxypskdebsesfwpqrfv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeHlwc2tkZWJzZXNmd3BxcmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzE0MTksImV4cCI6MjA2NTk0NzQxOX0.xmg8dQFM9i9Dt33XPSOeHvAsA6s68LBdPCZurfz7X08';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
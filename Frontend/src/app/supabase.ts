import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpummaulrgjosvehqwke.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdW1tYXVscmdqb3N2ZWhxd2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMjcyODcsImV4cCI6MjA5MTgwMzI4N30.5brOopeppFNMwqmAF8cB7esH82T1tW7SLppxpt70ZlM';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
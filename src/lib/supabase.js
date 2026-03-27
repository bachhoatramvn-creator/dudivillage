import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xsgkwhzdiqdnmximhcac.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZ2t3aHpkaXFkbm14aW1oY2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDczMjcsImV4cCI6MjA5MDA4MzMyN30.LH7XjacK_McSal1xXaX6er_efXyjXwba3jjX9KQxQVk'

export const supabase = createClient(supabaseUrl, supabaseKey)
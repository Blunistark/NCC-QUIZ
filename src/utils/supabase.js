import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xwmqgmkadjjgbfycpxja.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3bXFnbWthZGpqZ2JmeWNweGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2Nzk1OTUsImV4cCI6MjA1NDI1NTU5NX0.yBDDh0dDDYoSg-QXmLUee8B67RjHG9cBu0KTU5idlhU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

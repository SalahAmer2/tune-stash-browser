// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ypxekswqxgjvvxcqyufg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweGVrc3dxeGdqdnZ4Y3F5dWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMjg1ODcsImV4cCI6MjA2NDcwNDU4N30.Ei5XLH60emN97qvRwIGIEdR8uQby7PSsYF_SLe-dRgc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
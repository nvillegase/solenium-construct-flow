// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gjvwtybthqdgtpqnjwle.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqdnd0eWJ0aHFkZ3RwcW5qd2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MzE4MjEsImV4cCI6MjA2MTIwNzgyMX0.T8jTqhAX32ZrmJzG8wSe0c76k8Kmpqr5Wy_UAcUHdrE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qyblzbqpyasfoirqzdpo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5Ymx6YnFweWFzZm9pcnF6ZHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MDY1OTgsImV4cCI6MjA1MTA4MjU5OH0.dlA-UrbwhEkJevKK3ZrBSj88Iv23hKx1_Y0fjdZoi0Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
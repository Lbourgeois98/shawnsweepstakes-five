// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// ✅ Hardcode your Supabase credentials
const supabaseUrl = "https://sklglvegajouwxzbebao.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbGdsdmVnYWpvdXd4emJlYmFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MTMzNzgsImV4cCI6MjA3NTI4OTM3OH0.rLVzXxdOuSQduza9W4M8dHWeB-JqnzU03Qhe0AgyBV8";

export const supabase = createClient(supabaseUrl, supabaseKey);

const { createClient } = require("@supabase/supabase-js");

function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase browser environment variables.");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

module.exports = { getBrowserSupabase };

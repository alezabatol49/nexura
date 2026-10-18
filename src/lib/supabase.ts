import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dgwiuzizludfdmpsdffz.supabase.co";
const supabaseAnonKey = "sb_publishable_I1-xcAlIgmf8jwLOrEw9ng_X8sDkx2o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

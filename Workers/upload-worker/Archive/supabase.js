const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const supabaseUrl = "https://hwhyqxktgvimgzmlhecg.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; // Use module.exports instead of export default

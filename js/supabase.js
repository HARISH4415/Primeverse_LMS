/**
 * PrimeVerse LMS - Supabase Client Initialization
 * Central configuration file for Supabase integration.
 */

const SUPABASE_URL = "https://sljcqcksrqzanyivtdld.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0gsZlqZga8nHuyueFk_9pA_zjqH73dP";

let supabase;

try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
        console.log("Supabase Client initialized successfully.");
    } else {
        console.error("Supabase CDN failed to load. Please check your internet connection.");
    }
} catch (error) {
    console.error("Error initializing Supabase client:", error);
}

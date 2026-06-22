import { createClient } from '@supabase/supabase-js';
export const supabase=createClient(import.meta.env.VITE_SUPABASE_URL||'https://example.supabase.co',import.meta.env.VITE_SUPABASE_ANON_KEY||'anon-key');
export const signInWithGoogle=()=>supabase.auth.signInWithOAuth({provider:'google',options:{scopes:'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/spreadsheets'}});
export const signInWithPassword=(email:string,password:string)=>supabase.auth.signInWithPassword({email,password});
export const signUp=(email:string,password:string)=>supabase.auth.signUp({email,password});

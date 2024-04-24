export const MYSTOCKPROJECTID = 1;
export const MARKETAPI = "http://api.marketstack.com/v1/";
export const MARKETSTOCKSEARCH = `tickers?access_key=${process.env.NEXT_PUBLIC_SUPABASE_MARKETSTACKKEY}`;
export const MARKETSTOCKVOLUME = `eod/latest?access_key=${process.env.NEXT_PUBLIC_SUPABASE_MARKETSTACKKEY}`;
export const USERSTABLE = "users";
export const STOCKSTABLE = "stocks";
export const PROJECTTABLE = "projects";
export const MAXSTOCKLIMIT = 10;

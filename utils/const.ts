import { redirect } from "next/navigation";
import { getSupabase } from "./supabase";
import { ProjectProps, UserProps } from "./types";

export const MYSTOCKPROJECTID = 1;
export const MARKETAPI = "http://api.marketstack.com/v1/";
export const MARKETSTOCKSEARCH = `${MARKETAPI}tickers?access_key=${process.env.NEXT_PUBLIC_SUPABASE_MARKETSTACKKEY}`;
export const MARKETSTOCKVOLUME = `${MARKETAPI}eod/latest?access_key=${process.env.NEXT_PUBLIC_SUPABASE_MARKETSTACKKEY}`;
export const MARKETSTOCKDETAIL = `${MARKETAPI}eod?access_key=${process.env.NEXT_PUBLIC_SUPABASE_MARKETSTACKKEY}`;
export const MARKETSTOCKDETAILINTRADAY = `${MARKETAPI}intraday?access_key=${process.env.NEXT_PUBLIC_SUPABASE_MARKETSTACKKEY}`; //&interval=5min
export const USERSTABLE = "users";
export const STOCKSTABLE = "stocks";
export const PROJECTTABLE = "projects";
export const MAXSTOCKLIMIT = 10;
export const STOCKFILTER = ["1D", "5D", "1M", "6M", "1Y", "5Y", "MAX"];

export const fetchCurrentUser = async (session: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(USERSTABLE)
    .select(
      `
    id,
    name,
    email,
    is_admin,
    auth0_user_id,
    ${PROJECTTABLE} ( id, name )
  `
    )
    .eq("auth0_user_id", session?.user?.sub);
  if (data) {
    const user: UserProps = data[0];
    if (
      user?.is_admin != true &&
      user?.projects?.findIndex(
        (project: ProjectProps) => project.id == MYSTOCKPROJECTID
      )
    ) {
      redirect("/access-denied");
      return {};
    } else {
      return user;
    }
  }

  return {};
};

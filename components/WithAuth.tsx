import { PROJECTTABLE, USERSTABLE } from "@/utils/const";
import { getSupabase } from "@/utils/supabase";
import { UserProps } from "@/utils/types";
import { AppRouterPageRouteOpts, getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import React, { FC } from "react";

const fetchUser = async (session: any) => {
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
  return data?.[0] || {};
};

const withAuth = (Component: any) => {
  const WithAuth: any = async ({ ...props }) => {
    const session = await getSession();
    const user: UserProps = await fetchUser(session);
    console.log("user===>", user);
    if (user?.is_admin) {
      return <Component {...props} currentUser={user} />;
    } else {
      redirect("/access-denied");
      return null;
    }
  };

  return WithAuth;
};

export default withAuth;

import React from "react";
import Stocks from "@/components/Stocks";
import { MYSTOCKPROJECTID, PROJECTTABLE, USERSTABLE } from "@/utils/const";
import { getSupabase } from "@/utils/supabase";
import { ProjectProps, UserProps } from "@/utils/types";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

const fetchUser = async (session: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(USERSTABLE)
    .select(
      `
  id,
  name,
  email,
  auth0_user_id,
  ${PROJECTTABLE} ( id, name )
`
    )
    .eq("auth0_user_id", session?.user?.sub);
  return data ? data[0] : {};
};

const Home = async () => {
  const session = await getSession();
  if (session?.isLoading) return <div>Loading...</div>;
  if (session?.error) return <div>{session?.error?.message}</div>;
  const user: UserProps = await fetchUser(session);
  // console.log("===>stocks<==>", JSON.stringify(user));

  const renderStock = () => {
    if (
      user?.projects?.findIndex(
        (project: ProjectProps) => project.id == MYSTOCKPROJECTID
      )
    ) {
      redirect("/access-denied");
      return null;
    } else {
      return <Stocks user={user} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white p-5">
      <div className="z-10 w-full items-center justify-between text-sm ">
        {renderStock()}
      </div>
    </main>
  );
};

export default withPageAuthRequired(Home);

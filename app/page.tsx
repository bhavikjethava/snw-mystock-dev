import React from "react";
import Stocks from "@/components/Stocks";
import {
  MYSTOCKPROJECTID,
  PROJECTTABLE,
  USERSTABLE,
  fetchCurrentUser,
} from "@/utils/const";
import { getSupabase } from "@/utils/supabase";
import { ProjectProps, UserProps } from "@/utils/types";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getSession();
  if (session?.isLoading) return <div>Loading...</div>;
  if (session?.error) return <div>{session?.error?.message}</div>;
  const user: UserProps = await fetchCurrentUser(session);

  return (
    <main className="flex min-h-screen flex-col bg-white p-5">
      <div className="z-10 w-full items-center justify-between text-sm ">
        <Stocks user={user} />;
      </div>
    </main>
  );
};

export default withPageAuthRequired(Home);

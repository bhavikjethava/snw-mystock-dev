import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { getSupabase } from "@/utils/supabase";
import { USERSTABLE, fetchCurrentUser } from "@/utils/const";
import { UserProps } from "@/utils/types";

const Header = async () => {
  const session = await getSession();
  const user: UserProps = await fetchCurrentUser(session);

  return (
    <header className="flex justify-between items-center py-3 border-b px-20">
      <Link href="#" className="flex items-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          My Stocks
        </span>
      </Link>
      <div className="w-full flex-1 flex justify-end gap-7">
        <ul className="flex items-center lg:space-x-8 ">
          <li>
            <Link href="/" aria-current="page">
              Home
            </Link>
          </li>
          <li>
            <a href="#">About</a>
          </li>
        </ul>
        <div className="flex items-center border rounded-lg px-2 py-[4px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer gap-2">
                <span>{user?.name}</span>
                <Button className="rounded-full" size="icon" variant="ghost">
                  <Image
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width={32}
                    height={32}
                    className="rounded-full"
                    src={session?.user?.picture}
                    alt="Avatar"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem>
                <Link prefetch={false} href="/api/auth/logout">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

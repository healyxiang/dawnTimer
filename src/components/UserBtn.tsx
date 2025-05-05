"use client";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function UserBtn() {
  const { data: session } = useSession({ required: false });
  const userImg = session?.user?.image;
  console.log("session in UserBtn:", session);

  if (session) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn("sm:w-full")}>
            {userImg ? (
              <img className="w-8 rounded-md cursor-pointer" src={userImg} />
            ) : (
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-gray-100 text-primary font-bold">
                {session.user?.name?.charAt(0)}
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Button
            className={cn("sm:w-full")}
            variant="secondary"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Button className={cn("sm:w-full")} onClick={() => signIn()}>
      Sign in
    </Button>
  );
}

"use client";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function UserBtn() {
  const { data: session } = useSession({ required: false });
  const userImg = session?.user?.image;
  console.log("session in UserBtn:", session);

  useEffect(() => {
    const testApiCall = async () => {
      const response = await fetch("/api/test", {
        method: "GET",
        // body: JSON.stringify({
        //   model_id: 'dark-sushi-25d-v4',
        //   scheduler: 'UniPCMultistepScheduler',
        //   prompt: Prompt.test, // 替换为实际提示
        //   init_image: initImg,
        // }),
      });
      const data = await response.json();
      console.log("testApiCall data::", data);
      return data;
    };
    testApiCall();
  }, []);

  if (session) {
    return (
      <Popover>
        {/* <button onClick={() => signOut()}>
          <img className="w-8 rounded-md" src={session.user?.image} />
        </button> */}
        <PopoverTrigger asChild>
          <Button variant="ghost">
            {userImg && <img className="w-8 rounded-md" src={userImg} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Button variant="secondary" onClick={() => signOut()}>
            Sign Out
          </Button>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  );
}

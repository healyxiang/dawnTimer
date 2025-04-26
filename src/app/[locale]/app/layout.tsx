import { Metadata } from "next";
import { FOCUS_TIMER_TDK } from "@/constants/common";

export const metadata: Metadata = {
  title: FOCUS_TIMER_TDK.title,
  description: FOCUS_TIMER_TDK.description,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

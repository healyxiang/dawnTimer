"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
// import { Link } from "../i18n/navigation";
// TODO: 后续考虑使用 i18n 的 Link 优化
import { Languages } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { i18n, type Locale } from "../../i18n-config";

export default function LocaleSwitch() {
  const pathname = usePathname();
  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[40px]">
        {i18n.locales.map((locale) => {
          return (
            <DropdownMenuItem key={locale} className="w-full">
              <Link href={redirectedPathname(locale)} className="w-full">
                {locale}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// import Image from 'next/image'

import siteMetadata from "@/data/siteMetadata";
import headerNavLinks from "@/data/headerNavLinks";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import { ModeToggle } from "@/components/ThemeSwitch";
import UserBtn from "@/components/UserBtn";
// import LocaleSwitch from "@/components/LocaleSwitch";
// import ThemeSwitch from "./ThemeSwitch";
// import SearchButton from './SearchButton'
import { cn } from "@/lib/utils";
const Header = () => {
  let headerClass =
    "flex items-center w-full bg-white dark:bg-gray-950 py-5 border-b";
  if (siteMetadata.stickyNav) {
    headerClass += " sticky top-0 z-50";
  }

  return (
    <header
      className={cn(
        headerClass,
        "px-8 backdrop-blur supports-[backdrop-filter]:bg-background/6",
        "sm:px-4"
      )}
    >
      <Link
        href="/"
        aria-label={siteMetadata.headerTitle}
        className="text-primary"
      >
        <div className="flex items-center justify-between text-primary">
          {/* <div className="mr-3">
            <Image src={Logo} alt="Rednote Logo" width={40} height={40} />
          </div> */}
          {typeof siteMetadata.headerTitle === "string" ? (
            <div className={cn("text-2xl font-semibold text-primary-500", "")}>
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div
        className={cn(
          "flex ml-10 items-center space-x-4 leading-5 space-x-6  grow justify-end",
          "sm:space-x-3"
        )}
      >
        <div
          className={cn(
            "no-scrollbar flex items-center grow gap-x-4 overflow-x-auto pr-2",
            "sm:hidden"
          )}
        >
          {headerNavLinks
            // .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  "m-1 block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                )}
              >
                {link.title}
              </Link>
            ))}
        </div>
        {/* <SearchButton /> */}
        <div className="sm:hidden">
          <UserBtn />
        </div>
        <ModeToggle />
        {/* <LocaleSwitch /> */}
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;

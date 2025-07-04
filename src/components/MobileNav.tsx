"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { Fragment, useState, useEffect, useRef } from "react";
import Link from "./Link";
// import UserBtn from "./UserBtn";
import headerNavLinks from "@/data/headerNavLinks";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        if (navRef.current) {
          enableBodyScroll(navRef.current);
        }
      } else {
        if (navRef.current) {
          disableBodyScroll(navRef.current);
        }
      }
      return !status;
    });
  };

  useEffect(() => {
    return clearAllBodyScrollLocks;
  });

  return (
    <>
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className={cn("hidden", "sm:block")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-40 bg-black/25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <Dialog.Panel className="fixed right-0 top-[64px] z-50 h-[calc(100vh-64px)] w-full bg-white opacity-95 duration-300 dark:bg-gray-950 dark:opacity-[0.98]">
              <nav
                ref={navRef}
                className="flex h-full flex-col overflow-y-auto px-6 py-8"
              >
                {/* <div className="mt-8 mb-8 w-full">
                  <UserBtn />
                </div> */}

                <div className="flex flex-col space-y-4">
                  {headerNavLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-xl font-semibold tracking-wide text-gray-900 outline-none transition-colors hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                      onClick={onToggleNav}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </nav>

              <button
                className="absolute right-4 top-4 z-50 p-2 text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                aria-label="Close Menu"
                onClick={onToggleNav}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default MobileNav;

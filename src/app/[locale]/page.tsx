import { use } from "react";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import SimpleHero from "@/components/SimpleHero";
import Features from "@/components/Features";
// import { SectionTitle } from "@/components/SectionTitle";
import { Faq } from "@/components/Faq";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  console.log("locale in page", locale);

  setRequestLocale(locale);
  return (
    <div
      className={cn(
        "min-h-screen px-8 pb-20 font-[family-name:var(--font-geist-sans)]",
        "sm:p-0"
      )}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SimpleHero />
        <Features />
        {/* <SectionTitle
          preTitle="Nextly Benefits"
          title=" Why should you use this landing page"
        >
          Nextly is a free landing page & marketing website template for
          startups and indie projects. Its built with Next.js & TailwindCSS. And
          its completely open-source.
        </SectionTitle> */}
        <Faq />
      </main>
    </div>
  );
}

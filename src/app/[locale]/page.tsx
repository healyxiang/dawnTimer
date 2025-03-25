import { use } from "react";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Faq } from "@/components/Faq";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  console.log("locale in page", locale);

  setRequestLocale(locale);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Hero />
        <SectionTitle
          preTitle="Nextly Benefits"
          title=" Why should you use this landing page"
        >
          Nextly is a free landing page & marketing website template for
          startups and indie projects. Its built with Next.js & TailwindCSS. And
          its completely open-source.
        </SectionTitle>
        <Faq />
      </main>
    </div>
  );
}

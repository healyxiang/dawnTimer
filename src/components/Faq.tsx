"use client";
import React from "react";
import { Container } from "@/components/Container";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUp } from "lucide-react";

export const Faq = () => {
  return (
    <Container className="!p-0">
      <h2 className="text-2xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <div>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUp
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-primary-500`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "How can I improve my time management skills?",
    answer:
      "Start by prioritizing tasks, setting clear goals, and using tools like calendars or to-do lists. Our resources provide step-by-step guides..",
  },
  {
    question: "What resources do you offer for personal growth?",
    answer:
      "We offer articles, courses, and community support focused on mindset, habits, and career development.",
  },
  {
    question: "How can I access your content?",
    answer:
      "Sign up for free to access our library of resources, or subscribe for premium content and personalized coaching.",
  },
];

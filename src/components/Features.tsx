import { cn } from "@/lib/utils";
import { Clock4, ChartNoAxesCombined, List } from "lucide-react";

const features = [
  {
    title: "Time Management",
    description:
      "Learn techniques to optimize your daily schedule and achieve more.",
    icon: Clock4,
  },
  {
    title: "Task Management",
    description: "Create and manage tasks to stay on top of your work.",
    icon: List,
  },
  {
    title: "Efficiency",
    description:
      "Streamline your workflow and eliminate distractions for peak performance.",
    icon: ChartNoAxesCombined,
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          What DawnLibrary can do for you?
        </h2>
        <div className={cn("grid grid-cols-3 gap-8", "sm:grid-cols-1")}>
          {features.map((feature) => (
            <div
              className="bg-white p-6 rounded-lg shadow-sm text-center border"
              key={feature.title}
            >
              <div className="text-primary mb-4">
                <feature.icon className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

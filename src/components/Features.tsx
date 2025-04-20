import { cn } from "@/lib/utils";
import { Clock4, ChartNoAxesCombined, Zap } from "lucide-react";

export default function Features() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          What DawnLibrary can do for you?
        </h2>
        <div className={cn("grid grid-cols-3 gap-8", "sm:grid-cols-1")}>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border">
            <div className="text-primary mb-4">
              <Clock4 className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time Management</h3>
            <p className="text-gray-600">
              Learn techniques to optimize your daily schedule and achieve more.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border">
            <div className="text-primary mb-4">
              <Zap className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personal Growth</h3>
            <p className="text-gray-600">
              Unlock your potential with curated resources for self-improvement.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center border">
            <div className="text-primary mb-4">
              <ChartNoAxesCombined className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Efficiency</h3>
            <p className="text-gray-600">
              Streamline your workflow and eliminate distractions for peak
              performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

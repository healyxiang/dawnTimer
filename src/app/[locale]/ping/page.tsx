import { Suspense, use } from "react";
import { Loading } from "@/components/Loading";

async function fetchData(): Promise<{ value: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ value: "Ping Success!" }), 2000);
  });
}

function DataComponent() {
  const data = use(fetchData()); // 使用 use（实验性 API）
  return <div className="w-full h-full flex justify-center">{data.value}</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DataComponent />
    </Suspense>
  );
}

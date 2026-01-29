import { DataTable, SportData } from "@/components/data-table";

import data from "../data.json";

export default function SportPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <DataTable data={data as SportData[]} />
    </div>
  );
}

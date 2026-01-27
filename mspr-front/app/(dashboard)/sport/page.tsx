import { DataTable, SportData } from "@/components/data-table";

import data from "../data.json";

export default function SportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DataTable data={data as SportData[]} />
      </div>
    </div>
  );
}

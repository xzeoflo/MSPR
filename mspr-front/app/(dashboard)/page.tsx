"use client";

import { DistributionDonut } from "@/components/dashboard";
import { BrandsBarChart } from "@/components/bar-chart";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col p-4  space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DistributionDonut
          title="Users"
          description="Distribution des utilisateurs"
          endpoint="/stats/users-distribution"
        />
        <DistributionDonut
          title="Workouts"
          description="Distribution des types de workout"
          endpoint="/stats/types"
        />
        <DistributionDonut
          title="Exercises"
          description="Distribution des exercices"
          endpoint="/stats/exercises-distribution"
        />
        <DistributionDonut
          title="Meal Types"
          description="Distribution by category"
          endpoint="/stats/meals-types"
        />
      </div>
    </div>
  );
}

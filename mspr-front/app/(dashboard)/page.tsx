import { DistributionDonut } from "@/components/dashboard";
import { BrandsBarChart } from "@/components/bar-chart";


export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <DistributionDonut
              title="Users"
              description="Répartition des membres"
              endpoint="/stats/users-distribution"
            />
            <DistributionDonut
              title="Workouts"
              description="Par type de séance"
              endpoint="/stats/types"
            />
            <DistributionDonut
              title="Exercises"
              description="Types d'exercices"
              endpoint="/stats/exercises-distribution"
            />
          </div>
          <BrandsBarChart />
          <div className="px-4 lg:px-6">
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { getAuthToken } from "@/lib/auth";

const chartConfig = {
  workouts: { label: "Workouts", color: "var(--chart-1)" },
  users: { label: "Utilisateurs", color: "var(--chart-2)" },
  meals: { label: "Repas", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function BrandsBarChart() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      try {
        const res = await fetch("http://localhost:8080/api/v1/dashboard/stats/brands-comparison", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error("Erreur stats:", error);
      }
    };
    fetchData();
  }, []);

  const maxValue = React.useMemo(() => {
    if (data.length === 0) return 1;
    const values = data.flatMap((d: any) => [d.workouts, d.users, d.meals]);
    return Math.max(...values);
  }, [data]);

  return (
    <Card className="flex flex-col border-zinc-900 bg-zinc-950 text-white">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">Comparatif des Marques</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 px-2">
        <div className="h-[180px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 10, left: -35, bottom: 0 }}
                barGap={5}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                <XAxis
                  dataKey="brand"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  allowDecimals={false}
                  domain={[0, maxValue]}
                  tickCount={maxValue + 1}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '9px', top: -10 }}
                />
                {/* 4. barSize augmenté pour des barres plus larges */}
                <Bar
                  dataKey="workouts"
                  fill="var(--chart-1)"
                  radius={[2, 2, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="users"
                  fill="var(--chart-2)"
                  radius={[2, 2, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="meals"
                  fill="var(--chart-3)"
                  radius={[2, 2, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

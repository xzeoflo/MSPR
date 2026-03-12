"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { getAuthToken } from "@/lib/auth";

const chartConfig = {
  workouts: { label: "Workouts", color: "var(--chart-1)" },
  users: { label: "Utilisateurs", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function BrandsBarChart() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      const res = await fetch("http://localhost:8080/api/v1/dashboard/stats/brands-comparison", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setData(await res.json());
    };
    fetchData();
  }, []);

  return (
    <Card className="border-zinc-900 bg-zinc-950 text-white">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider">Comparatif des Marques</CardTitle>
        <CardDescription className="text-zinc-500">Volume de données par partenaire</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="brand"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="top" align="right" />
            <Bar
              dataKey="workouts"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              dataKey="users"
              fill="var(--chart-2)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

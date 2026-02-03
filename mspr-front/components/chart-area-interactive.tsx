"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  {
    date: "2024-06-03",
    program: "Force",
    age18_24: 40,
    age25_34: 45,
    age35_plus: 35,
  },
  {
    date: "2024-06-03",
    program: "Cardio",
    age18_24: 30,
    age25_34: 35,
    age35_plus: 40,
  },
  {
    date: "2024-06-10",
    program: "Force",
    age18_24: 52,
    age25_34: 50,
    age35_plus: 42,
  },
  {
    date: "2024-06-10",
    program: "Cardio",
    age18_24: 45,
    age25_34: 48,
    age35_plus: 50,
  },
  {
    date: "2024-06-17",
    program: "Force",
    age18_24: 68,
    age25_34: 62,
    age35_plus: 55,
  },
  {
    date: "2024-06-17",
    program: "Cardio",
    age18_24: 60,
    age25_34: 58,
    age35_plus: 65,
  },
  {
    date: "2024-06-24",
    program: "Force",
    age18_24: 85,
    age25_34: 75,
    age35_plus: 68,
  },
  {
    date: "2024-06-24",
    program: "Cardio",
    age18_24: 78,
    age25_34: 72,
    age35_plus: 82,
  },
];

const chartConfig = {
  age18_24: { label: "18-24 ans", color: "var(--chart-1)" },
  age25_34: { label: "25-34 ans", color: "var(--chart-2)" },
  age35_plus: { label: "35+ ans", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [selectedAge, setSelectedAge] = React.useState("all");
  const [selectedProgram, setSelectedProgram] = React.useState("Force");

  const filteredByProgram = chartData.filter(
    (d) => d.program === selectedProgram,
  );

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Performance par Segment</CardTitle>
          <CardDescription>
            Visualisation des taux de réussite (0-100%)
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-2 p-4 sm:p-6 items-center">
          <Select value={selectedProgram} onValueChange={setSelectedProgram}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Programme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Force">🏋️ Force</SelectItem>
              <SelectItem value="Cardio">🏃 Cardio</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAge} onValueChange={setSelectedAge}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Tranche d'âge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les âges</SelectItem>
              <SelectItem value="age18_24">18-24 ans</SelectItem>
              <SelectItem value="age25_34">25-34 ans</SelectItem>
              <SelectItem value="age35_plus">35+ ans</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={filteredByProgram}>
            <defs>
              {Object.keys(chartConfig).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      chartConfig[key as keyof typeof chartConfig].color
                    }
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      chartConfig[key as keyof typeof chartConfig].color
                    }
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.2}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              unit="%"
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tickCount={6}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Legend verticalAlign="top" align="right" iconType="circle" />

            {(selectedAge === "all" || selectedAge === "age35_plus") && (
              <Area
                name="35+ ans"
                dataKey="age35_plus"
                type="monotone"
                fill="url(#fillage35_plus)"
                stroke="var(--chart-3)"
                strokeWidth={2}
              />
            )}
            {(selectedAge === "all" || selectedAge === "age25_34") && (
              <Area
                name="25-34 ans"
                dataKey="age25_34"
                type="monotone"
                fill="url(#fillage25_34)"
                stroke="var(--chart-2)"
                strokeWidth={2}
              />
            )}
            {(selectedAge === "all" || selectedAge === "age18_24") && (
              <Area
                name="18-24 ans"
                dataKey="age18_24"
                type="monotone"
                fill="url(#fillage18_24)"
                stroke="var(--chart-1)"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

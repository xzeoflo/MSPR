"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { getAuthToken } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DonutProps {
  title: string;
  description: string;
  endpoint: string;
}

export function DistributionDonut({ title, description, endpoint }: DonutProps) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`http://localhost:8080/api/v1/dashboard${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setData(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  const total = React.useMemo(() => data.reduce((acc, curr: any) => acc + curr.value, 0), [data]);

  return (
    <Card className="flex flex-col border-zinc-900 bg-zinc-950 text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xs font-bold uppercase tracking-widest">{title}</CardTitle>
        <CardDescription className="text-zinc-500 text-[10px]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[200px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5} stroke="transparent">
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-2xl font-bold">{total}</tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-zinc-500 text-[10px] uppercase">Total</tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

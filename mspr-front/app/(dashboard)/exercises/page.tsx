"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "@/components/exercises/exercise-columns";
import { getAuthToken } from "@/lib/auth";
import { Exercise } from "@/types/exercise";
import { IconAlertCircle, IconLoader2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function ExercisesPage() {
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const getWorkouts = async () => {
      const token = getAuthToken();
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/exercises", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const rawText = await response.text();

        try {
          const jsonData = JSON.parse(rawText);
          setData(Array.isArray(jsonData) ? jsonData : []);
          setError(null);
        } catch (parseError) {
          console.error("JSON Parse Error Details:", parseError);
          console.error("Raw text received from server:", rawText);
          throw new Error("Invalid JSON format. Check for circular references in Backend.");
        }

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        console.error("[Fetch Error]:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getWorkouts();
  }, []);
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Exercises
          </h1>
          <p className="text-muted-foreground text-sm">
            {loading
              ? "Loading sessions..."
              : error
                ? "Error loading data"
                : `Manage your training programs (${data.length} sessions).`}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-center gap-3">
          <IconAlertCircle className="h-4 w-4" />
          <div>
            <p className="font-bold">API Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        !error && (
          <DataTable<Exercise>
            data={data}
            columns={columns}
            filterColumn="intensityLevel"
            filters={[
              { label: "Beginner", value: "BEGINNER" },
              { label: "Intermediate", value: "INTERMEDIATE" },
              { label: "Advanced", value: "ADVANCED" },
              { label: "Nightmare", value: "NIGHTMARE" },
            ]}
          />
        )
      )}
    </div>
  );
}

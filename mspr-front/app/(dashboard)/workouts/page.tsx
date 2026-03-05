"use client";

import { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Workout } from "@/types/workout";
import { getColumns } from "@/components/workouts/workout-columns";
import { getAuthToken } from "@/lib/auth";
import { IconAlertCircle, IconLoader2, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateWorkoutViewer } from "@/components/workouts/create-workout-viewer";

export default function WorkoutsPage() {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchWorkouts = async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/workouts", {
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
        throw new Error("Invalid JSON format.");
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchWorkouts();
  }, []);

  const columns = useMemo(() => getColumns(fetchWorkouts), []);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workouts
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

      {loading && data.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        !error && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="default"
                size="sm"
                className="h-8"
                onClick={() => setCreateOpen(true)}
              >
                <IconPlus /> Create Workout
              </Button>
              <CreateWorkoutViewer
                open={createOpen}
                setOpen={setCreateOpen}
                onWorkoutCreated={fetchWorkouts}
              />
            </div>

            <DataTable<Workout>
              data={data}
              columns={columns}
              filterColumn="difficulty"
              filters={[
                { label: "Beginner", value: "beginner" },
                { label: "Intermediate", value: "intermediate" },
                { label: "Advanced", value: "advanced" },
              ]}
            />
          </>
        )
      )}
    </div>
  );
}

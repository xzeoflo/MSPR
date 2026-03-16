"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Workout } from "@/types/workout";
import { getColumns } from "@/components/workouts/workout-columns";
import { getAuthToken } from "@/lib/auth";
import { IconAlertCircle, IconLoader2, IconPlus, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateWorkoutViewer } from "@/components/workouts/create-workout-viewer";
import { Separator } from "@/components/ui/separator";

export default function WorkoutsPage() {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      setError(null);
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
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchWorkouts();
  }, [fetchWorkouts]);

  const columns = useMemo(() => getColumns(fetchWorkouts), [fetchWorkouts]);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workouts
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {loading
              ? "Syncing sessions..."
              : error
                ? "Connection failed"
                : `Manage your training programs (${data.length} sessions).`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchWorkouts}
            disabled={loading}
            className="h-9 w-9"
          >
            <IconRefresh
              size={18}
              className={`${loading ? "animate-spin" : ""} text-muted-foreground`}
            />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          <Button
            variant="default"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="h-9 gap-2 px-4 shadow-sm"
          >
            <IconPlus size={18} />
            <span className="font-semibold">Create Workout</span>
          </Button>
        </div>
      </div>

      <CreateWorkoutViewer
        open={createOpen}
        setOpen={setCreateOpen}
        onWorkoutCreated={fetchWorkouts}
      />

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive flex items-start gap-3 shadow-sm">
          <IconAlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm leading-none mb-1">API Error</h3>
            <p className="text-xs opacity-90">{error}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchWorkouts} className="h-7 text-xs hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30">
          <IconLoader2 className="h-10 w-10 animate-spin text-primary/40" />
          <p className="text-sm font-medium text-muted-foreground">Loading your programs...</p>
        </div>
      ) : (
        !error && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <DataTable<Workout>
              data={data}
              columns={columns}
              filterColumn="difficulty"
              filters={[
                { label: "Beginner", value: "BEGINNER" },
                { label: "Intermediate", value: "INTERMEDIATE" },
                { label: "Advanced", value: "ADVANCED" },
              ]}
            />
          </div>
        )
      )}
    </div>
  );
}

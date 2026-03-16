"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/exercises/exercise-columns";
import { getAuthToken } from "@/lib/auth";
import { Exercise } from "@/types/exercise";
import { IconAlertCircle, IconLoader2, IconRefresh, IconPlus, IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateExerciseViewer } from "@/components/exercises/create-exercises-viewer";
import { Separator } from "@/components/ui/separator";
import { handleExport } from "@/hooks/use-exercise-moderation";

export default function ExercisesPage() {
  const [data, setData] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchExercises = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/exercises", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const jsonData = await response.json();
      setData(Array.isArray(jsonData) ? jsonData : []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchExercises();
  }, [fetchExercises]);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 space-y-5">
      {/* HEADER & ACTIONS BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Exercises
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {loading
              ? "Syncing with database..."
              : error
                ? "Connection failed"
                : `Managing ${data.length} movement patterns.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={fetchExercises}
            disabled={loading}
            className="h-9 w-9"
          >
            <IconRefresh
              size={18}
              className={`${loading ? "animate-spin" : ""} text-muted-foreground`}
            />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9 gap-2 px-4 shadow-sm border-zinc-800"
          >
            <IconDownload size={18} />
            <span className="font-semibold text-xs uppercase tracking-tight text-muted-foreground">
              Export JSON
            </span>
          </Button>

          {/* Create Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="h-9 gap-2 px-4 shadow-sm"
          >
            <IconPlus size={18} />
            <span className="font-semibold">Create Exercise</span>
          </Button>
        </div>
      </div>

      <CreateExerciseViewer
        open={createOpen}
        setOpen={setCreateOpen}
        onExerciseCreated={fetchExercises}
      />

      {/* ERROR STATE */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive flex items-start gap-3 shadow-sm">
          <IconAlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm leading-none mb-1">API Connection Error</h3>
            <p className="text-xs opacity-90">{error}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchExercises} className="h-7 text-xs hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      )}

      {/* TABLE / LOADING STATE */}
      {loading && data.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30">
          <IconLoader2 className="h-10 w-10 animate-spin text-primary/40" />
          <p className="text-sm font-medium text-muted-foreground">Fetching catalog...</p>
        </div>
      ) : (
        !error && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <DataTable<Exercise>
              data={data}
              columns={getColumns(fetchExercises)}
              filterColumn="exerciseType"
              filters={[
                { label: "Cardio", value: "CARDIO" },
                { label: "Strength", value: "STRENGTH" },
                { label: "Strongman", value: "STRONGMAN" },
                { label: "Stretching", value: "STRETCHING" },
                { label: "Powerlifting", value: "POWERLIFTING" },
                { label: "Plyometrics", value: "PLYOMETRICS" },
              ]}
            />
          </div>
        )
      )}
    </div>
  );
}

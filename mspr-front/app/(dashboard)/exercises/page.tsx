"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/exercises/exercise-columns";
import { getAuthToken } from "@/lib/auth";
import { Exercise } from "@/types/exercise";
import { IconAlertCircle, IconLoader2, IconRefresh, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateExerciseViewer } from "@/components/exercises/create-exercises-viewer"

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

      const response = await fetch("http://localhost:8080/api/v1/exercises", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(Array.isArray(jsonData) ? jsonData : []);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("[Fetch Error]:", errorMessage);
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
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Exercises
          </h1>
          <p className="text-muted-foreground text-sm">
            {loading
              ? "Loading exercises..."
              : error
                ? "Error loading data"
                : `Catalogue of ${data.length} movement patterns.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bouton Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExercises}
            disabled={loading}
            className="gap-2 h-9"
          >
            <IconRefresh size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Bouton de création */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-2 h-9"
          >
            <IconPlus size={16} />
            Create Exercise
          </Button>
        </div>
      </div>

      {/* Le Drawer de création */}
      <CreateExerciseViewer
        open={createOpen}
        setOpen={setCreateOpen}
        onExerciseCreated={fetchExercises}
      />

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
          <IconAlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold leading-none mb-1">API Error</h3>
            <p className="text-sm opacity-90">{error}</p>
            <p className="text-xs mt-2 italic text-destructive/80">
              Check if the backend is running at :8080 and /api/v1/exercises is correct.
            </p>
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
            filterColumn="name"
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

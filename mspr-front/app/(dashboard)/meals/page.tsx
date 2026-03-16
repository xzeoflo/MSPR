"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { getColumns } from "@/components/meals/meal-columns";
import { getAuthToken } from "@/lib/auth";
import { Meal } from "@/types/meal";
import {
  IconAlertCircle,
  IconLoader2,
  IconRefresh,
  IconPlus,
  IconDownload
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateMealViewer } from "@/components/meals/create-meals-viewer";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function MealsPage() {
  const [data, setData] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false); // État pour l'export

  const [createOpen, setCreateOpen] = useState(false);

  const fetchMeals = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8080/api/meals", {
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

  const handleExportCSV = async () => {
    const token = getAuthToken();
    setExporting(true);

    try {
      const response = await fetch("http://localhost:8080/api/meals/export", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Export failed");

      const mealsToExport = await response.json();
      if (mealsToExport.length === 0) {
        toast.error("No data to export");
        return;
      }

      const columns = [
        { label: "Food_Item", key: "name" },
        { label: "Category", key: "mealType" },
        { label: "Calories (kcal)", key: "caloriesKcal" },
        { label: "Protein (g)", key: "proteinG" },
        { label: "Carbohydrates (g)", key: "carbsG" },
        { label: "Fat (g)", key: "fatsG" },
        { label: "Fiber (g)", key: "fiberG" },
        { label: "Sugars (g)", key: "sugarG" },
        { label: "Sodium (mg)", key: "sodiumMg" },
        { label: "Cholesterol (mg)", key: "cholesterolMg" },
        { label: "Meal_Type", key: "mealType" },
        { label: "Water_Intake (ml)", key: "waterIntake" }
      ];

      const headerRow = columns.map(col => col.label).join(",");

      const dataRows = mealsToExport.map((meal: any) => {
        return columns.map(col => {
          const value = meal[col.key];

          if (value === null || value === undefined) {
            return col.label.includes("(") ? "0" : "";
          }

          return String(value);
        }).join(",");
      });

      const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `meals_tracker_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success("CSV Exported (Raw format)");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during export");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchMeals();
  }, [fetchMeals]);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Meals
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {loading
              ? "Syncing with database..."
              : error
                ? "Connection failed"
                : `Managing ${data.length} meals.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={exporting || loading}
            className="h-9 gap-2 px-3"
          >
            {exporting ? <IconLoader2 size={18} className="animate-spin" /> : <IconDownload size={18} />}
            <span className="hidden md:inline font-semibold text-xs uppercase tracking-wider">Export</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchMeals}
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
            <span className="font-semibold">Create Meal</span>
          </Button>
        </div>
      </div>

      <CreateMealViewer
        open={createOpen}
        setOpen={setCreateOpen}
        onMealCreated={fetchMeals}
      />

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive flex items-start gap-3 shadow-sm">
          <IconAlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm leading-none mb-1">API Connection Error</h3>
            <p className="text-xs opacity-90">{error}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchMeals} className="h-7 text-xs hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30">
          <IconLoader2 className="h-10 w-10 animate-spin text-primary/40" />
          <p className="text-sm font-medium text-muted-foreground">Fetching catalog...</p>
        </div>
      ) : (
        !error && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <DataTable<Meal>
              data={data}
              columns={getColumns(fetchMeals)}
              filterColumn="mealType"
              filters={[]}
            />
          </div>
        )
      )}
    </div>
  );
}

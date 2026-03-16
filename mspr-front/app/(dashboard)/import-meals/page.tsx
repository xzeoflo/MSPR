"use client";

import * as React from "react";
import {
  IconUpload, IconLoader2, IconRefresh, IconCheck, IconTrash,
  IconDatabaseExport, IconX, IconInbox, IconAlertCircle, IconSoup
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useMealModeration } from "@/hooks/use-meal-moderation";

export default function MealConsole() {
  const [mounted, setMounted] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    meals,
    selectedIds,
    setSelectedIds,
    isLoading,
    isSyncing,
    isPushing,
    handleSync,
    handleDelete,
    handleDeleteAll,
    handlePushToDB,
    handleImportMealsCSV,
  } = useMealModeration();

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Veuillez sélectionner un fichier CSV");
      return;
    }

    setIsImporting(true);
    await handleImportMealsCSV(file);
    setIsImporting(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectAll = () => setSelectedIds(meals.map((m) => m.id!));

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-1 flex-col p-4 space-y-5">
      <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".csv" className="hidden" />

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <IconSoup className="text-emerald-500" size={24} />
            <h1 className="text-2xl font-bold tracking-tight">Import Meals Controller</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            {isLoading ? "Syncing..." : `Reviewing ${meals.length} meal patterns.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleSync} disabled={isSyncing || isLoading}>
            <IconRefresh size={18} className={isSyncing || isLoading ? "animate-spin" : "text-muted-foreground"} />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
          <Button
            variant="outline" size="sm" disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 gap-2 px-4 border-zinc-800 shadow-sm"
          >
            {isImporting ? <IconLoader2 className="animate-spin" size={18} /> : <IconUpload size={18} />}
            <span className="font-semibold text-xs uppercase tracking-tight">Import Kaggle CSV</span>
          </Button>
        </div>
      </div>

      {/* ACTIONS BAR */}
      <div className="flex items-center justify-between h-10 px-1 bg-muted/10 rounded-lg border border-border/40">
        <div className="flex items-center gap-4 px-2">
          {meals.length > 0 ? (
            <>
              <button onClick={selectAll} className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest transition-colors">Select All</button>
              <Separator orientation="vertical" className="h-4" />
              <button onClick={handleDeleteAll} className="text-[10px] text-rose-500 hover:text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                <IconTrash size={12} /> Reject All
              </button>
              {selectedIds.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <button onClick={() => setSelectedIds([])} className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <IconX size={12} /> Cancel ({selectedIds.length})
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-zinc-600 italic">
              <IconAlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Queue is empty</span>
            </div>
          )}
        </div>

        {selectedIds.length > 0 && (
          <Button size="sm" onClick={handlePushToDB} disabled={isPushing} className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-4 font-bold text-[10px]">
            {isPushing ? <IconLoader2 className="animate-spin mr-2" size={14} /> : <IconDatabaseExport size={14} className="mr-2" />}
            VALIDATE SELECTION ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="max-h-[550px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur-md text-muted-foreground z-10 border-b">
              <tr className="text-left text-[10px] tracking-widest uppercase font-bold">
                <th className="px-4 py-3 w-12 text-center">Sel.</th>
                <th className="px-4 py-3">Meal Name</th>
                <th className="px-4 py-3 text-center">Kcal</th>
                <th className="px-4 py-3 text-center">P (g)</th>
                <th className="px-4 py-3 text-center">G (g)</th>
                <th className="px-4 py-3 text-center">L (g)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {meals.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={7} className="py-32 text-center opacity-30">
                    <div className="flex flex-col items-center gap-3">
                      <IconInbox size={48} stroke={1} />
                      <p className="text-xs italic">Upload a CSV to start moderation.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                meals.map((meal) => {
                  const isSelected = selectedIds.includes(meal.id!);
                  return (
                    <tr
                      key={meal.id}
                      onClick={() => toggleSelect(meal.id!)}
                      className={`group cursor-pointer transition-colors ${isSelected ? "bg-emerald-500/5" : "hover:bg-muted/30"}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <div className={`mx-auto w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-emerald-500 border-emerald-500 text-black" : "border-zinc-700 bg-zinc-900"}`}>
                          {isSelected && <IconCheck size={10} stroke={4} />}
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${isSelected ? "text-emerald-400" : ""}`}>{meal.name}</td>
                      <td className="px-4 py-3 text-center font-mono text-orange-400">{meal.caloriesKcal || 0}</td>
                      <td className="px-4 py-3 text-center text-zinc-400">{meal.proteinG || 0}</td>
                      <td className="px-4 py-3 text-center text-zinc-400">{meal.carbsG || 0}</td>
                      <td className="px-4 py-3 text-center text-zinc-400">{meal.fatsG || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(meal.id!);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-500 hover:text-white rounded-md transition-all"
                        >
                          <IconTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  IconUpload,
  IconLoader2,
  IconBarbell,
  IconRefresh,
  IconCheck,
  IconTrash,
  IconDatabaseExport,
  IconX,
  IconInbox,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useExerciseModeration } from "@/hooks/use-exercise-moderation";
import { toast } from "sonner";

export default function ExerciseConsole() {
  const [mounted, setMounted] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    exercises,
    selectedIds,
    setSelectedIds,
    isLoading,
    isSyncing,
    isPushing,
    isImporting,
    handleSync,
    handleDelete,
    handlePushToDB,
    handleImport,
    handleDeleteAll,
  } = useExerciseModeration();

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // --- LOGIQUE D'IMPORT (Connectée à ton handleImport) ---
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await handleImport(json);
      } catch (error) {
        toast.error("Format JSON invalide");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  // --- ACTIONS ---
  const selectAll = () => setSelectedIds(exercises.map((ex) => ex.id!));


  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-1 flex-col p-4 space-y-5">
      <input type="file" ref={fileInputRef} onChange={onFileChange} accept=".json" className="hidden" />

      {/* HEADER : Match exact avec ta page Exercises */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Exercises Controller</h1>
          <p className="text-muted-foreground text-sm font-medium">
            {isLoading ? "Syncing with database..." : `Reviewing ${exercises.length} movement patterns.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleSync} disabled={isSyncing || isLoading} className="h-9 w-9">
            <IconRefresh size={18} className={`${isSyncing ? "animate-spin" : ""} text-muted-foreground`} />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
          <Button
            variant="outline"
            size="sm"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 gap-2 px-4 border-zinc-800 shadow-sm"
          >
            {isImporting ? <IconLoader2 className="animate-spin" size={18} /> : <IconUpload size={18} />}
            <span className="font-semibold text-xs uppercase tracking-tight">Import JSON</span>
          </Button>
        </div>
      </div>

      {/* ACTIONS BAR */}
      <div className="flex items-center justify-between h-10 px-1 bg-muted/10 rounded-lg border border-border/40">
        <div className="flex items-center gap-4 px-2">
          {exercises.length > 0 ? (
            <>
              <button onClick={selectAll} className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-widest transition-colors">
                Select All
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button
                onClick={handleDeleteAll}
                className="text-[10px] text-rose-500 hover:text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <IconTrash size={12} /> Reject All
              </button>
              {selectedIds.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <button onClick={() => setSelectedIds([])} className="text-[10px] text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <IconX size={12} /> Cancel ({selectedIds.length})
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-zinc-600">
              <IconAlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest italic">Queue is empty</span>
            </div>
          )}
        </div>

        {selectedIds.length > 0 && (
          <Button
            size="sm"
            onClick={handlePushToDB}
            disabled={isPushing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-4 font-bold text-[10px] shadow-sm"
          >
            {isPushing ? <IconLoader2 className="animate-spin mr-2" size={14} /> : <IconDatabaseExport size={14} className="mr-2" />}
            VALIDATE SELECTION ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="max-h-[550px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur-md text-muted-foreground z-10 border-b">
              <tr className="text-left">
                <th className="px-4 py-3 w-12 text-center font-bold uppercase text-[10px] tracking-widest">Sel.</th>
                <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Name</th>
                <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Type</th>
                <th className="px-4 py-3 font-bold uppercase text-[10px] tracking-widest">Intensity</th>
                <th className="px-4 py-3 text-right font-bold uppercase text-[10px] tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && exercises.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <IconLoader2 className="h-10 w-10 animate-spin text-primary/40 mx-auto" />
                  </td>
                </tr>
              ) : exercises.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                      <IconInbox size={48} stroke={1} />
                      <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-tighter text-foreground">Inbox Clean</p>
                        <p className="text-xs italic tracking-tight">No exercises to moderate at this time.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                exercises.map((ex) => {
                  const isSelected = selectedIds.includes(ex.id!);
                  return (
                    <tr
                      key={ex.id}
                      onClick={() => toggleSelect(ex.id!)}
                      className={`group transition-colors cursor-pointer ${isSelected ? "bg-emerald-500/5" : "hover:bg-muted/30"}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <div className={`mx-auto w-4 h-4 rounded border transition-all ${isSelected ? "bg-emerald-500 border-emerald-500 text-zinc-950" : "border-zinc-700 bg-zinc-900"
                          }`}>
                          {isSelected && <IconCheck size={12} stroke={4} />}
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-semibold transition-colors ${isSelected ? "text-emerald-400" : ""}`}>
                        {ex.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-zinc-800/50 px-2 py-0.5 text-[10px] font-bold text-zinc-400 border border-zinc-700/50 uppercase">
                          {ex.exerciseType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-[11px] uppercase font-medium">
                        {ex.intensityLevel}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(ex.id!); }}
                          className="p-2 rounded-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
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

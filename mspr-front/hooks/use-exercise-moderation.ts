import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";

export interface ExerciseDTO {
  id?: number;
  name: string;
  intensityLevel: string;
  exerciseType: string;
  status?: string;
}

export function useExerciseModeration() {
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const token = getAuthToken();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/exercises/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExercises(data.filter((ex: ExerciseDTO) => ex.status === "PENDING"));
      }
    } catch (err) {
      toast.error("Erreur lors de la récupération");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("http://localhost:8080/api/exercises/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Synchronisation effectuée");
        setTimeout(fetchData, 500);
      }
    } catch (err) { toast.error("Erreur réseau"); }
    finally { setIsSyncing(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/exercises/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setExercises(prev => prev.filter(ex => ex.id !== id));
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        toast.info("Exercice écarté");
      }
    } catch (err) { toast.error("Erreur lors du rejet"); }
  };

  const handleDeleteAll = async () => {
    if (exercises.length === 0) return;

    try {
      const idsToDelete = exercises.map(ex => ex.id).filter(Boolean);

      await Promise.all(idsToDelete.map(id =>
        fetch(`http://localhost:8080/api/exercises/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        })
      ));

      setExercises([]);
      setSelectedIds([]);
      toast.success("File de modération vidée");
    } catch (err) {
      toast.error("Erreur lors de la suppression totale");
      fetchData();
    }
  };

  const handlePushToDB = async () => {
    if (selectedIds.length === 0) return;
    setIsPushing(true);
    try {
      const toPush = exercises.filter(ex => selectedIds.includes(ex.id!));
      await Promise.all(toPush.map(ex =>
        fetch(`http://localhost:8080/api/exercises/${ex.id}/validate`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ ...ex, status: "APPROVED" })
        })
      ));
      toast.success("Exercices envoyés en base finale !");
      setSelectedIds([]);
      fetchData();
    } catch (err) { toast.error("Erreur PUSH"); }
    finally { setIsPushing(false); }
  };

  const handleImport = async (json: any) => {
    setIsImporting(true);
    try {
      const res = await fetch("http://localhost:8080/api/exercises/import", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      if (res.ok) {
        toast.success("Importation réussie");
        fetchData();
      }
    } catch (err) { toast.error("Erreur importation"); }
    finally { setIsImporting(false); }
  };

  return {
    exercises, selectedIds, setSelectedIds,
    isLoading, isSyncing, isPushing, isImporting,
    handleSync, handleDelete, handlePushToDB, handleImport, fetchData, handleDeleteAll, handleExport
  };
}


export const handleExport = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/exercises/export", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });

    if (!res.ok) throw new Error("Export failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `exercises_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("Exportation réussie");
  } catch (err) {
    toast.error("Erreur lors de l'exportation");
  }
};

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";

export interface MealDTO {
  id: number;
  name: string;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG?: number;
  sugarG?: number;
  status: "PENDING" | "APPROVED";
  partnerBrand?: string;
}
export function useMealModeration() {
  const [meals, setMeals] = useState<MealDTO[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  // --- 1. CHARGEMENT DES DONNÉES ---
  const fetchMeals = useCallback(async () => {
    const token = getAuthToken();
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/meals", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const pendingMeals = data.filter((m: any) => m.status === "PENDING");
        setMeals(pendingMeals);
      }
    } catch (err) {
      toast.error("Impossible de charger les repas en attente");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 2. IMPORT CSV (Ta fonction améliorée) ---
  const handleImportMealsCSV = async (file: File) => {
    const token = getAuthToken();
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8080/api/meals/import-csv", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("Importation réussie !");
        await fetchMeals();
      } else {
        const errorMessage = await res.text();
        toast.error(`Échec : ${errorMessage}`);
      }
    } catch (err) {
      toast.error("Erreur réseau lors de l'importation");
    }
  };

  // --- 3. SUPPRESSION / REJET ---
  const handleDelete = async (id: number) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`http://localhost:8080/api/meals/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        setMeals((prev) => prev.filter((m) => m.id !== id));
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
        toast.success("Repas rejeté");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePushToDB = async () => {
    if (selectedIds.length === 0) return;
    setIsPushing(true);
    const token = getAuthToken();

    try {
      const res = await fetch("http://localhost:8080/api/meals/bulk-validate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedIds),
      });

      if (res.ok) {
        toast.success(`${selectedIds.length} repas validés !`);
        setMeals(prev => prev.filter(m => !selectedIds.includes(m.id)));
        setSelectedIds([]);
      }
    } catch (err) {
      toast.error("Erreur lors de la validation");
    } finally {
      setIsPushing(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    selectedIds,
    setSelectedIds,
    isLoading,
    isSyncing,
    isPushing,
    fetchMeals,
    handleSync: fetchMeals,
    handleDelete,
    handleDeleteAll: () => {
      if (confirm("Voulez-vous rejeter toute la liste ?")) {
        setSelectedIds([]);
        setMeals([]);
      }
    },
    handlePushToDB,
    handleImportMealsCSV,
  };
}

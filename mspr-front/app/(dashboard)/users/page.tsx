"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    const getUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/users", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.error(`[API Error] Status: ${response.status}`);
          return;
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("[Fetch Error]:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Utilisateurs
        </h1>
        <p className="text-muted-foreground">
          {loading
            ? "Chargement des données..."
            : data.length > 0
              ? `Gérez les membres de votre plateforme (${data.length} utilisateurs).`
              : "Aucun utilisateur trouvé."}
        </p>
      </div>
      {!loading && <DataTable data={data} />}
    </div>
  );
}

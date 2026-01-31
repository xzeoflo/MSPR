"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { getAuthToken } from "@/lib/auth";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const getUsers = async () => {
      const token = getAuthToken();
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
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
          Users
        </h1>
        <p className="text-muted-foreground">
          {loading
            ? "Loading data..."
            : data.length > 0
              ? `Manage your platform members (${data.length} users).`
              : "No users found."}
        </p>
      </div>
      {!loading && <DataTable data={data} />}
    </div>
  );
}

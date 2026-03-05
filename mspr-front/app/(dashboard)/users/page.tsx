"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { getAuthToken } from "@/lib/auth";
import { columns } from "@/components/users/user-columns";
import { IconAlertCircle, IconLoader2, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateUserViewer } from "@/components/users/create-user-viewer";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchUsers = async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const rawText = await response.text();

      try {
        const jsonData = JSON.parse(rawText);
        setData(Array.isArray(jsonData) ? jsonData : []);
        setError(null);
      } catch (parseErr: unknown) {
        console.error("JSON Parse Error Details:", parseErr);
        console.error("Raw text received:", rawText);
        throw new Error("Invalid JSON format. Check for circular references in Backend.");
      }

    } catch (err: unknown) {
      let message = "An unknown error occurred";
      if (err instanceof Error) message = err.message;

      console.error("[Fetch Error]:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-muted-foreground text-sm">
            {loading
              ? "Loading members..."
              : error
                ? "Error loading data"
                : `Manage your platform members (${data.length} users).`}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-600 flex items-start gap-3">
          <IconAlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold leading-none mb-1">API Error</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        !error && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="default"
                size="sm"
                className="h-8"
                onClick={() => setCreateOpen(true)}
              >
                <IconPlus /> Create User
              </Button>
              <CreateUserViewer
                open={createOpen}
                setOpen={setCreateOpen}
                onUserCreated={fetchUsers}
              />
            </div>
            <DataTable<User>
              data={data}
              columns={columns}
              filterColumn="role"
              filters={[
                { label: "Admins", value: "admin" },
                { label: "Coaches", value: "coach" },
                { label: "Clients", value: "client" }
              ]}
            />
          </>
        )
      )}
    </div>
  );
}

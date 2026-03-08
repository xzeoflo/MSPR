"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/data-table";
import { User } from "@/types/user";
import { getAuthToken } from "@/lib/auth";
import { columns } from "@/components/users/user-columns";
import { IconAlertCircle, IconLoader2, IconPlus, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CreateUserViewer } from "@/components/users/create-user-viewer";
import { Separator } from "@/components/ui/separator";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      setError(null);
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
      } catch (parseErr: unknown) {
        console.error("JSON Parse Error Details:", parseErr);
        throw new Error("Invalid JSON format. Check backend response.");
      }

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
    fetchUsers();
  }, [fetchUsers]);

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {loading
              ? "Updating member list..."
              : error
                ? "Connection failed"
                : `Manage your platform members (${data.length} users).`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchUsers}
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
            <span className="font-semibold">Create User</span>
          </Button>
        </div>
      </div>

      <CreateUserViewer
        open={createOpen}
        setOpen={setCreateOpen}
        onUserCreated={fetchUsers}
      />

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive flex items-start gap-3 shadow-sm">
          <IconAlertCircle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm leading-none mb-1">API Error</h3>
            <p className="text-xs opacity-90">{error}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchUsers} className="h-7 text-xs hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30">
          <IconLoader2 className="h-10 w-10 animate-spin text-primary/40" />
          <p className="text-sm font-medium text-muted-foreground">Loading users...</p>
        </div>
      ) : (
        !error && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <DataTable<User>
              data={data}
              columns={columns}
              filterColumn="role"
              filters={[
                { label: "Admins", value: "ADMIN" },
                { label: "Coaches", value: "COACH" },
                { label: "Clients", value: "CLIENT" }
              ]}
            />
          </div>
        )
      )}
    </div>
  );
}

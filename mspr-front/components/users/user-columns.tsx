import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconLoader2 } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DragHandle } from "../drag-handle";
import { UserCellViewer } from "./user-cell-viewer";
import { useState } from "react";
import { getAuthToken } from "@/lib/auth";
import { toast } from "sonner";

const ActionCell = ({ user }: { user: User }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(`User ${user.firstname} deleted`);
        window.location.reload();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={isDeleting}>
          {isDeleting ? <IconLoader2 className="animate-spin size-4" /> : <IconDotsVertical className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 font-medium"
          onClick={handleDelete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "firstname",
    header: "User",
    cell: ({ row }) => <UserCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const variants: Record<string, string> = {
        ADMIN: "bg-red-700 text-white border-red-700",
        COACH: "bg-blue-700 text-white border-blue-700",
        CLIENT: "bg-emerald-700 text-white border-emerald-600",
      };
      return (
        <div className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${variants[role]}`}>
          {role}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-sm italic text-muted-foreground">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "partnerBrand",
    header: "Partner Brand",
    cell: ({ row }) => (
      <div className="text-sm italic text-muted-foreground">
        {row.original.partnerBrand || "Independent"}
      </div>
    ),
  },
  {
    accessorKey: "subscriptionTier",
    header: "Subscription",
    cell: ({ row }) => <Badge variant="outline">{row.original.subscriptionTier || "FREE"}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell user={row.original} />,
  },
];

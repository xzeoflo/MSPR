import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DragHandle } from "./drag-handle";
import { UserCellViewer } from "./user-cell-viewer";

export const columns: ColumnDef<User>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstname",
    header: "Utilisateur",
    cell: ({ row }) => <UserCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Rôle",
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
    accessorKey: "birthday",
    header: "Âge",
    cell: ({ row }) => {
      return <div className="font-medium">{birthday} {typeof birthday === 'number' ? 'ans' : ''}</div>;
    },
  },
  {
    accessorKey: "partnerBrand",
    header: "Entreprise Partenaire",
    cell: ({ row }) => (
      <div className="text-sm italic text-muted-foreground">
        {row.original.partnerBrand || "Indépendant"}
      </div>
    ),
  },
  {
    accessorKey: "subscriptionTier",
    header: "Abonnement",
    cell: ({ row }) => <Badge variant="outline">{row.original.subscriptionTier || "FREE"}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8"><IconDotsVertical /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => console.log("Edit", row.original.id)}>Modifier</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => console.log("Delete", row.original.id)}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

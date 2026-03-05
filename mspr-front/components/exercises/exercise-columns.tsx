"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "@/types/exercise";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconDatabase } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { DragHandle } from "../drag-handle";

export const columns: ColumnDef<Exercise>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => {
      const id = row.original.id;
      if (id === undefined) return null;
      return <DragHandle id={id} />;
    },
  },
  {
    accessorKey: "id",
    header: "Exercise ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <IconDatabase size={14} />
        {row.original.id}
      </div>
    ),
  },
  {
    id: "placeholder",
    header: "Status",
    cell: () => (
      <div className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-slate-100 text-slate-500 border-slate-200 inline-flex">
        Pending Implementation
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <IconDotsVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => console.log("View", row.original.id)}>
            Quick View
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 font-medium"
            onClick={() => console.log("Delete Exercise", row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Workout } from "@/types/workout";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  IconClock,
  IconDotsVertical,
  IconFlame,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { WorkoutCellViewer } from "./workout-cell-viewer";
import { DragHandle } from "../drag-handle";

export const columns: ColumnDef<Workout>[] = [
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
    accessorKey: "title",
    header: "Workout",
    cell: ({ row }) => <WorkoutCellViewer item={row.original} />,
  },
  {
    accessorKey: "difficulty",
    header: "Intensity",
    cell: ({ row }) => {
      const difficultyValue = row.original.difficulty ?? "";
      const difficulty = difficultyValue.toUpperCase();

      let variantClasses = "";
      switch (difficulty) {
        case "BEGINNER":
          variantClasses = "bg-emerald-700 border-emerald-700";
          break;
        case "INTERMEDIATE":
          variantClasses = "bg-yellow-700 border-yellow-700";
          break;
        case "ADVANCED":
          variantClasses = "bg-red-700 border-red-700";
          break;
        case "NIGHTMARE":
          variantClasses = "bg-purple-700 border-purple-700";
          break;
        default:
          variantClasses = "bg-slate-700 border-slate-700";
      }

      return (
        <div className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border text-white ${variantClasses}`}>
          <IconFlame size={10} />
          {difficultyValue}
        </div>
      );
    },
  },
  {
    accessorKey: "totalDurationInSeconds",
    header: "Duration",
    cell: ({ row }) => {
      const totalSeconds: number = row.original.totalDurationInSeconds ?? 0;

      const formatDuration = (seconds: number) => {
        if (seconds === 0) return "0s";

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
      };

      return (
        <div className="flex items-center gap-1.5 text-sm font-medium font-mono">
          <IconClock size={14} className="text-muted-foreground" />
          {formatDuration(totalSeconds)}
        </div>
      );
    },
  },
  {
    accessorKey: "workoutType",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0">
        <span className="text-sm font-medium leading-tight">
          {row.original.workoutType}
        </span>
        <span className="text-[10px] text-muted-foreground italic leading-tight">
          {row.original.exerciseType}
        </span>
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
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <IconDotsVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => console.log("Stats", row.original.id)}>
            Statistics
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 font-medium"
            onClick={() => console.log("Delete", row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

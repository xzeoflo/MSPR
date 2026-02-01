"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { Identifiable } from "@/types/table";

interface DraggableRowProps<TData extends Identifiable> {
  row: Row<TData>;
}

export function DraggableRow<TData extends Identifiable>({ row }: DraggableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="bg-background">
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

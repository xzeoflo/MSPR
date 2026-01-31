"use client";
import * as React from "react";
import { DndContext, closestCenter, MouseSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, flexRender, SortingState, VisibilityState, ColumnFiltersState } from "@tanstack/react-table";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconLayoutColumns, IconPlus, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { User } from "@/types/user";
import { columns } from "./users/user-columns";
import { DraggableRow } from "./users/draggable-row";

export function DataTable({ data: initialData }: { data: User[] }) {
  const [data, setData] = React.useState<User[]>(initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  React.useEffect(() => { setData(initialData); }, [initialData]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));
  const dataIds = React.useMemo(() => data?.map(({ id }) => id) || [], [data]);

  const table = useReactTable({
    data, columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.id.toString(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id as number);
        const newIndex = dataIds.indexOf(over.id as number);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between p-4">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><IconLayoutColumns size={16} /> Colonnes</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter(c => c.getCanHide()).map(c => (
                <DropdownMenuCheckboxItem key={c.id} checked={c.getIsVisible()} onCheckedChange={v => c.toggleVisibility(!!v)}>{c.id}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm"><IconPlus size={16} /> Ajouter</Button>
        </div>
      </div>

      <TabsContent value="all" className="p-4">
        <div className="border rounded-lg">
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map(hg => (
                  <TableRow key={hg.id}>
                    {hg.headers.map(h => <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>)}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">{table.getFilteredSelectedRowModel().rows.length} sélectionné(s)</div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><IconChevronLeft /></Button>
            <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><IconChevronRight /></Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

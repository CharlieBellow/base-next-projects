"use client";


import DataTableActions from "@/app/tableexemple/components/DataTableActions";
import { Post } from "@/Utils/types";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/tableexemple/components/DataTableColumnHeader";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Título' />,
  },
  {
    accessorKey: "views",
    header: ({ column }) => <DataTableColumnHeader column={column} title='Visualizações' />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      return <DataTableActions post={post} />;
    },
  },
];

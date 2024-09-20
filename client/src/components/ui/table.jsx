import React, { useState } from "react";
import {
  getCoreRowModel,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";

const TableComponent = ({
  data,
  columns,
  onSelect = () => {},
  multiSelect = false,
}) => {
  const [selectedRows, setSelectedRows] = useState({});

  const table = useReactTable({
    data,
    columns: [
      ...(multiSelect
        ? [
            {
              id: "select",
              header: ({ table }) => (
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const allRows = table.getRowModel().rows;
                    const newSelectedRows = isChecked
                      ? allRows.reduce(
                          (acc, row) => ({ ...acc, [row.id]: true }),
                          {}
                        )
                      : {};
                    setSelectedRows(newSelectedRows);

                    // Return selected category objects
                    const selectedObjects = isChecked
                      ? allRows.map((row) => row.original)
                      : [];
                    onSelect(selectedObjects);
                  }}
                  checked={
                    table.getRowModel().rows.length > 0 &&
                    Object.keys(selectedRows).length ===
                      table.getRowModel().rows.length
                  }
                />
              ),
              cell: ({ row }) => (
                <input
                  type="checkbox"
                  checked={!!selectedRows[row.id]}
                  onChange={() => {
                    const newSelectedRows = {
                      ...selectedRows,
                      [row.id]: !selectedRows[row.id],
                    };
                    setSelectedRows(newSelectedRows);

                    // Return selected category objects
                    const selectedObjects = Object.keys(newSelectedRows)
                      .filter((key) => newSelectedRows[key])
                      .map((key) => table.getRowModel().rows[key].original);
                    onSelect(selectedObjects);
                  }}
                />
              ),
            },
          ]
        : []),
      ...columns,
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-md">
        <thead className="bg-gray-200 text-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-gray-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left font-semibold text-sm"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {data && data.length > 0 ? (
          <tbody className="text-gray-700">
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`${
                  rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-b border-gray-200 hover:bg-gray-100 cursor-default`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr className="border-b border-gray-200">
              <td
                colSpan={columns.length + (multiSelect ? 1 : 0)} // Adjust for checkbox column
                className="px-4 py-2 text-sm text-gray-600 text-center"
              >
                No data available
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default TableComponent;

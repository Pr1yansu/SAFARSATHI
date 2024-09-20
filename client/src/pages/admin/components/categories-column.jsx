import { IconPickerItem } from "react-icons-picker";

const CategoriesColumn = [
  {
    header: "ID",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {row.original._id}
        </p>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    header: "Icon",
    cell: ({ row }) => {
      return (
        <IconPickerItem value={row.original.icon} size={18} color="#000" />
      );
    },
  },
  {
    accessorKey: "label",
    header: "Label",
  },
];

export default CategoriesColumn;

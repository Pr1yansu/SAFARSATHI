import React from "react";
import ReactSelect from "react-select";
import useModal from "../../../components/hooks/modal";
import { formatDate } from "../../../components/utils/utils";
import { useProfileQuery } from "../../../store/apis/user";
import toast from "react-hot-toast";
const RoleChange = ({ row }) => {
  const [role, setRole] = React.useState(row.original.role);
  const {
    data: profile,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useProfileQuery();
  const { open } = useModal();

  if (profileLoading || profileFetching) {
    return null;
  }

  return (
    <ReactSelect
      options={[
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
      ]}
      value={{
        value: row.original?.role,
        label: row.original?.role,
      }}
      onChange={(e) => {
        if (row.original._id === profile?._id) {
          toast.error("You can't change your own role");
          return;
        }

        setRole(e.value);
        if (e.value !== row.original.role) {
          open("role-change", {
            user: row.original,
            role: e.value,
          });
        }
      }}
      menuPortalTarget={document.body}
      className="capitalize w-32"
      styles={{
        control: (styles) => ({
          ...styles,
          width: "fit-content",
          border: "none",
          boxShadow: "none",
        }),
        indicatorSeparator: (styles) => ({
          ...styles,
          display: "none",
        }),
      }}
    />
  );
};

const UsersColumn = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    header: "Created At",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {formatDate(row.original.createdAt)}
        </p>
      );
    },
  },
  {
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <p className="text-sm text-gray-600 w-20 overflow-hidden text-ellipsis text-nowrap">
          {formatDate(row.original.updatedAt)}
        </p>
      );
    },
  },
  {
    header: "Role",
    cell: ({ row }) => {
      return <RoleChange row={row} />;
    },
  },
];

export default UsersColumn;

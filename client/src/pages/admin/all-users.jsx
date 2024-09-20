import React from "react";
import { useGetAllUsersQuery } from "../../store/apis/user";
import Loader from "../../components/ui/loader";
import toast from "react-hot-toast";
import TableComponent from "../../components/ui/table";
import UsersColumn from "./components/users-column";
import useModal from "../../components/hooks/modal";
import RoleChangeConfirmation from "./modals/role-change";
import Button from "../../components/ui/button";

const AllUsers = () => {
  const [page, setPage] = React.useState(1);
  const { data: roleChangeData, variant, isOpen } = useModal();

  const {
    data: userData,
    isLoading: userLoading,
    isFetching: userFetching,
    error: userError,
  } = useGetAllUsersQuery({ page });

  React.useEffect(() => {
    if (userError) {
      toast.error(userError.message);
    }
  }, [userError]);

  if (userLoading || userFetching) {
    return <Loader />;
  }

  const hasUserData = userData && userData.totalPages;

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-lg font-semibold text-gray-700 mb-4">All Users</h4>
      {hasUserData ? (
        <>
          <TableComponent data={userData.users} columns={UsersColumn} />
          {isOpen && variant === "role-change" && (
            <RoleChangeConfirmation data={roleChangeData} />
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-md mr-2"
              size="sm"
              intent="outline"
            >
              Prev
            </Button>
            <Button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, userData.totalPages))
              }
              disabled={page === userData.totalPages}
              className="rounded-md"
              size="sm"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default AllUsers;

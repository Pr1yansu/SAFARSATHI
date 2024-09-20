import React, { useEffect } from "react";
import IconPicker, { IconPickerItem } from "react-icons-picker";
import ReactSelect from "react-select";
import { motion } from "framer-motion";
import CategoriesColumn from "./components/categories-column";
import TableComponent from "../../components/ui/table";
import Button from "../../components/ui/button";
import useModal from "../../components/hooks/modal";
import { RxCross1 } from "react-icons/rx";
import Input from "../../components/ui/input";
import {
  useCreateCategoryMutation,
  useDeleteCategoriesMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../store/apis/categories";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { TbTrashX } from "react-icons/tb";

const Categories = () => {
  const {
    data: categories,
    isLoading,
    isFetching,
    refetch,
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategories] = useDeleteCategoriesMutation();
  const [loading, setLoading] = React.useState(false);
  const [categoryData, setCategoryData] = React.useState({
    name: "",
    icon: "",
  });

  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const {
    isOpen: isModalOpen,
    variant,
    close: closeModal,
    open: openModal,
  } = useModal();
  const [selected, setSelected] = React.useState({
    value: "",
    label: "",
    icon: "",
    id: "",
  });

  const handleAddCategory = async () => {
    toast.dismiss();
    try {
      setLoading(true);
      if (categoryData.icon === "" || categoryData.name === "") {
        toast.error("Please select an icon and enter a category name");
        return;
      }
      const { data, error } = await createCategory(categoryData);

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        toast.success(data);
        setCategoryData({
          name: "",
          icon: "",
        });
        closeModal();
        refetch();
      }
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    toast.dismiss();
    try {
      setLoading(true);
      const { data, error } = await updateCategory({
        ...categoryData,
        id: selected.id,
      });

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        toast.success(data);
        closeModal();
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategories = async () => {
    toast.dismiss();
    try {
      setLoading(true);
      const { data, error } = await deleteCategories({
        categories: selectedCategories.map((c) => c._id),
      });

      if (error) {
        toast.error(error);
        return;
      }

      if (data) {
        toast.success(data);
        setSelectedCategories([]);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete categories");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selected.label.length > 1) {
      setCategoryData({
        name: selected.label,
        icon: selected.icon,
      });
    }
  }, [selected]);

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto my-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800">CATEGORIES</h1>
        <p className="text-gray-500 text-sm">
          Add a new category by clicking the button below. You can also edit or
          delete existing categories.
        </p>
        <div className="flex gap-2 items-center">
          <ReactSelect
            className="w-full"
            options={categories}
            value={selected.label.length > 1 ? selected : null}
            isSearchable={true}
            loadingMessage={() => "Loading..."}
            noOptionsMessage={() => (
              <div className="flex flex-col items-center gap-4">
                <span>No categories found</span>
                <Button
                  onClick={() => {
                    openModal("add-category");
                  }}
                >
                  Add Category
                </Button>
              </div>
            )}
            placeholder="Select a category"
            formatOptionLabel={(option) => (
              <div className="flex items-center gap-4">
                <IconPickerItem value={option.icon} size={18} color="#000" />
                <span>{option.label}</span>
              </div>
            )}
            onChange={(v) => {
              if (v.label === selected.label) {
                setSelected({
                  value: "",
                  label: "",
                  icon: "",
                  id: "",
                });
              } else {
                setSelected({
                  value: v.value,
                  label: v.label,
                  icon: v.icon,
                  id: v._id,
                });
              }
            }}
          />

          <Button
            intent="primary"
            onClick={() => {
              openModal("add-category");
            }}
            className={"!text-sm text-nowrap rounded-sm"}
          >
            {selected.label === "" ? "Add Category" : "Edit Category"}{" "}
            <FiPlus className="ms-2" />
          </Button>
        </div>
        <div className="flex gap-2 items-start">
          <div className="w-full">
            <TableComponent
              data={categories}
              columns={CategoriesColumn}
              multiSelect
              onSelect={(e) => {
                setSelectedCategories(e);
              }}
            />
          </div>
          {selectedCategories.length > 0 && (
            <div className="flex gap-2">
              <Button
                intent="danger"
                className={"!text-sm rounded-md"}
                size="icon"
                onClick={handleDeleteCategories}
              >
                <TbTrashX size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && variant === "add-category" && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={closeModal}
        >
          <motion.div
            className="bg-white rounded-md p-4 shadow-md max-w-md w-full mx-6 relative space-y-2"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Button
              className="absolute p-1 top-2 right-2"
              size="icon"
              intent="ghost"
              onClick={closeModal}
              disabled={loading}
            >
              <RxCross1 size={20} />
            </Button>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-baseline gap-6 uppercase">
              Add Category
            </h4>
            <p className="text-gray-500 text-sm">
              Add a new category by selecting an icon and entering a category
            </p>
            <div className="flex items-center gap-2">
              <IconPicker
                value={categoryData.icon}
                onChange={(v) => setCategoryData({ ...categoryData, icon: v })}
                pickButtonStyle={{
                  border: "1px solid #e5e7eb",
                  padding: "0.6rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
                searchBarStyle={{
                  borderRadius: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #e5e7eb",
                }}
              />
              <Input
                type="text"
                placeholder="Category name"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value })
                }
              />
            </div>
            {selected.id && (
              <Button
                size="sm"
                intent="primary"
                className="rounded-sm ms-auto"
                onClick={handleUpdateCategory}
                disabled={loading}
              >
                {loading ? "Updating category..." : "Update Category"}
              </Button>
            )}
            {!selected.id && (
              <Button
                size="sm"
                intent="primary"
                className="rounded-sm ms-auto"
                onClick={handleAddCategory}
                disabled={loading}
              >
                {loading ? "Adding category..." : "Add Category"}
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Categories;

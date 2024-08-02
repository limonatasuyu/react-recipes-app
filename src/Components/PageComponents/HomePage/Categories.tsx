import { CategoryData } from "../../../interfaces";
import { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import Modal from "../../Modal";
import { AddCategoryForm } from "./AddCategoryForm";
import { EditCategoryForm } from "./EditCategoryForm";
import { DeleteCategory } from "../../../logic/CategoryLogic";
import { showToast } from "../../Toast";

export function Categories({ data, mutate }: { data: CategoryData[]; mutate: () => void }) {
  const [modalType, setModalType] = useState<"Edit" | "Add" | "Delete" | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const handleEdit = (event: MouseEvent<HTMLDivElement>, categoryId: number) => {
    event.preventDefault();
    setSelectedCategoryId(categoryId);
    setModalType("Edit");
  };

  const handleDelete = () => {
    if (selectedCategoryId === null) return;
    DeleteCategory({ id: selectedCategoryId }).then((result) => {
      if (result.success) {
        showToast(result.message, "success");
        setModalType(null);
        mutate();
      } else {
        showToast(result.message, "error");
      }
    });
  };

  return (
    <div className="flex justify-center 2xl:w-[80%]">
      <div
        className={`cursor-pointer flex flex-wrap justify-center sm:justify-start lg:grid lg:grid-cols-4 2xl:grid-cols-3 ${
          data.length < 3 ? "" : "sm:grid sm:grid-cols-3"
        } md:grid-cols-4 h-fit`}
      >
        <button
          className="group w-[75%] mr-4 p-4 block sm:w-full sm:mr-0 h-fit"
          onClick={() => setModalType("Add")}
        >
          <img src="placeHolderFood.png" alt="food" className="w-full" />
          <div className="group-hover:opacity-50 bg-[#d24309] text-white text-center py-4">
            Add New Category +
          </div>
        </button>

        {data.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="group w-[75%] mr-4 p-4 block sm:w-full sm:mr-0 h-fit"
          >
            <div className="w-full aspect-square overflow-hidden relative">
              <img
                src={category.imageDataUrl ?? "placeHolderFood.png"}
                alt="food"
                className="w-full"
              />
              <div className="flex gap-4 absolute top-2 right-2">
                <div
                  className="bg-gray-500 p-2 opacity-50 rounded hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(e, category.id);
                  }}
                >
                  <img src="edit-icon.png" alt="edit-icon" className="w-[1.5rem]" />
                </div>
                <div
                  className="bg-gray-500 p-2 opacity-50 rounded hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setModalType("Delete");
                    setSelectedCategoryId(category.id);
                  }}
                >
                  <img src="delete-icon.png" alt="delete-icon" className="w-[1.5rem]" />
                </div>
              </div>
            </div>
            <div className="group-hover:opacity-50 bg-[#d24309] py-4 flex text-white items-center gap-2">
              <div className="text-center w-full capitalize">{category.name}</div>
            </div>
          </Link>
        ))}
      </div>

      <Modal title={`${modalType} Category`} isOpen={Boolean(modalType)} onClose={() => setModalType(null)}>
        {modalType === "Add" && <AddCategoryForm handleClose={() => setModalType(null)} mutate={mutate} />}
        {modalType === "Edit" && selectedCategoryId !== null && (
          <EditCategoryForm
            handleClose={() => setModalType(null)}
            categoryId={selectedCategoryId}
            mutate={mutate}
          />
        )}
        {modalType === "Delete" && (

          <div>
            <h2 className="text-3xl text-center font-bold mt-4">Are you sure, all recipes in this category will be deleted too ?</h2>
          <div className="flex justify-around mt-2">
            <button className="rounded py-2 px-4 text-white bg-[#d24309] hover:opacity-50" onClick={handleDelete}>
              Delete
            </button>
            <button className="rounded py-2 px-4 text-white bg-gray-300" onClick={() => setModalType(null)}>
              Cancel
            </button>
          </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


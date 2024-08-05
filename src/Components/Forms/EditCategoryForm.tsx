import { useState, ChangeEvent, ChangeEventHandler, useEffect } from "react";
import { showToast } from "../Toast";
import { GetCategory, UpdateCategory } from "../../logic/CategoryLogic";

export function EditCategoryForm({
  handleClose,
  categoryId,
  mutate,
}: {
  handleClose: () => void;
  categoryId: number;
  mutate: () => void;
}) {
  const [textValue, setTextValue] = useState("");
  const [picture, setPicture] = useState<string | null>(null);
  const [pictureName, setPictureName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTextValid, setIsTextValid] = useState(true);

  useEffect(() => {
    GetCategory({ id: categoryId }).then((result) => {
      if (result.success) {
        setTextValue(result.data.name);
        if (result.data.imageDataUrl) setPicture(result.data.imageDataUrl);
      }
      else showToast(result.message, "error")
    });
  }, [categoryId]);

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setPictureName(e.target.files[0].name);
    e.target.files = null;
  };

  function handleSubmit() {
    if (!textValue.length) {
      setIsTextValid(false);
      return;
    }

    setIsSubmitting(true);
    document.body.style.cursor = "wait";
    UpdateCategory({
      name: textValue,
      imageDataUrl: picture,
      id: categoryId,
    }).then((result) => {
      setIsSubmitting(false);
      if (result.success) {
        handleClose();
        showToast(result.message, "success");
        mutate();
      } else showToast(result.message, "error");
      document.body.style.cursor = "initial";
    });
  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setTextValue(e.target.value);
    if (e.target.value.length) setIsTextValid(true);
    else setIsTextValid(false);
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="mr-8">
          <div className="h-40 w-40 overflow-hidden border-gray-300 border-2 rounded-lg">
            <img
              src={picture ?? "placeHolder.png"}
              className="w-full h-full object-cover"
              alt="category"
            />
          </div>
          <label
            htmlFor="category-image-input"
            className="flex flex-col items-center mt-4"
          >
            <div className="rounded-full px-4 py-2 text-white bg-[#d24309] hover:bg-[#b13607] cursor-pointer transition-colors duration-300">
              {picture ? "Change" : "Add"} Image
            </div>
            {pictureName && (
              <div className="mt-2 text-sm text-gray-600">{pictureName}</div>
            )}
          </label>
          <input
            id="category-image-input"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex-1 mb-16">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Category Name</label>
            <input
              type="text"
              className="w-full border-gray-300 border-2 rounded-lg py-2 px-3 outline-none focus:border-[#d24309] transition-colors duration-300"
              onChange={handleTextChange}
              value={textValue}
            />
            {!isTextValid && (
              <p className="text-red-400 font-bold mt-2">
                Please insert a valid category name
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-6">
        <button
          className={`rounded-full py-2 px-6 text-white bg-[#d24309] hover:bg-[#b13607] transition-colors duration-300 ${
            isSubmitting ? "opacity-50" : ""
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit
        </button>
        <button
          className="rounded-full py-2 px-6 text-white bg-gray-400 hover:bg-gray-500 transition-colors duration-300"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

import { useState, ChangeEvent, ChangeEventHandler } from "react";
import { showToast } from "../../Toast";
import { AddCategory } from "../../../logic/CategoryLogic";

export function AddCategoryForm({ handleClose, mutate }: { handleClose: any; mutate: () => void; }) {
  const [textValue, setTextValue] = useState("");
  const [picture, setPicture] = useState<string | null>(null);
  const [pictureName, setPictureName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTextValid, setIsTextValid] = useState(true);

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
      setIsTextValid(false)
      return
    }

    setIsSubmitting(true);
    document.body.style.cursor = "wait"
    AddCategory({name: textValue, imageDataUrl: picture}).then((result) => {
      setIsSubmitting(false)
      if (result.success) {
        handleClose()
        showToast(result.message, "success")
        mutate()
      } else showToast(result.message, "error") 
      document.body.style.cursor = "initial"
    })

  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setTextValue(e.target.value)
    if (e.target.value.length) setIsTextValid(true)
    else setIsTextValid(false)
  }

  return (
    <div>
      <div className="flex items-center">
        <div>
          <div className="h-40 w-40 overflow-hidden border-gray-300 border-2 rounded">
            <img
              src={picture ?? "placeHolder.png"}
              className="w-40"
              alt="category"
            />
          </div>
          <label
            htmlFor="category-image-input"
            className="flex flex-col items-center mt-2"
          >
            <div className="rounded-xl px-4 text-white bg-[#d24309] hover:opacity-50 cursor-pointer">
              {picture ? "Change" : "Add"} Image
            </div>
            <div>{pictureName}</div>
          </label>
          <input
            id="category-image-input"
            type="file"
            accept="image/png image/jpeg"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="mb-16 ml-12">
          <label>Category Name</label>
          <input
            type="text"
            className="border-[#d24309] border-2 outline-none rounded"
            onChange={handleTextChange}
            value={textValue}
          />
          {!isTextValid && <p className="text-red-400 font-bold">Please insert a valid category name</p>}
        </div>
      </div>
      <div className="flex justify-around mt-2">
        <button
          className={`rounded py-2 px-4 text-white bg-[#d24309] hover:opacity-50 ${isSubmitting ? "opacity-50" : ""}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit
        </button>
        <button
          className="rounded py-2 px-4 text-white bg-gray-300"
          onClick={handleClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


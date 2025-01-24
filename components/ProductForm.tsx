import React, { useState } from "react";

interface Portion {
  size: string;
  price: string;
}

interface FormProps {
  categories: string[];
  portionOptions: string[];
  onSubmit: (formData: any) => void;
}

const Form = ({ categories, portionOptions, onSubmit }: FormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    portions: [{ size: "", price: "" }],
    image: "",
    imagePreview: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePortionChange = (index: number, field: string, value: string) => {
    const updatedPortions = [...formData.portions];
    updatedPortions[index][field as keyof Portion] = value;
    setFormData({ ...formData, portions: updatedPortions });
  };

  const addPortion = () => {
    setFormData({
      ...formData,
      portions: [...formData.portions, { size: "", price: "" }],
    });
  };

  const removePortion = (index: number) => {
    const updatedPortions = formData.portions.filter((_, i) => i !== index);
    setFormData({ ...formData, portions: updatedPortions });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file.name, imagePreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-4 p-6 rounded-md text-black"
      style={{ background: "linear-gradient(to right, #f3e6d7, #fbead6)" }}
    >
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-semibold">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border rounded-md p-2"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="category" className="mb-1 font-semibold">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border rounded-md p-2"
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col col-span-2">
        <label htmlFor="description" className="mb-1 font-semibold">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="border rounded-md p-2 w-full"
        />
      </div>

      {formData.portions.map((portion, index) => (
        <div key={index} className="col-span-2 flex items-center gap-4">
          <select
            value={portion.size}
            onChange={(e) => handlePortionChange(index, "size", e.target.value)}
            className="border rounded-md p-2 flex-1"
          >
            <option value="">Select size</option>
            {portionOptions.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={portion.price}
            onChange={(e) => handlePortionChange(index, "price", e.target.value)}
            placeholder="Price"
            className="border rounded-md p-2 flex-1"
          />
          <button
            type="button"
            onClick={() => removePortion(index)}
            className="bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="w-full mt-4 col-span-2 flex justify-start">
        <button
          type="button"
          onClick={addPortion}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-col col-span-1">
        <label htmlFor="image" className="mb-1 font-semibold">Image</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          className="border rounded-md p-2"
        />
      </div>

      {formData.imagePreview && (
        <div className="col-span-1 flex justify-end">
          <img src={formData.imagePreview} alt="Preview" className="rounded-md w-48 h-auto" />
        </div>
      )}

      <div className="col-span-2 flex justify-between mt-4">
        <button
          type="button"
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          Cancel
        </button>

        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md">
          Save
        </button>
      </div>
    </form>
  );
};

export default Form;

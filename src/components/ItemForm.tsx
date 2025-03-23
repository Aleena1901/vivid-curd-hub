
import React, { useState } from "react";
import { Item } from "@/lib/item-service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ItemFormProps {
  item?: Item;
  onSubmit: (formData: Partial<Item>) => Promise<void>;
  isLoading: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
  item,
  onSubmit,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Item>>({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    imageUrl: item?.imageUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
      toast.success(item ? "Item updated successfully" : "Item created successfully");
      navigate("/items");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <div className="glass-card">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Item name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field min-h-[120px]"
            placeholder="Item description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="block text-sm font-medium">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => navigate("/items")}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ItemForm;

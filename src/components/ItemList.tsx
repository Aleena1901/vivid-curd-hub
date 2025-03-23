
import React from "react";
import { Link } from "react-router-dom";
import { Item } from "@/lib/item-service";
import ItemCard from "./ItemCard";
import { PlusIcon } from "lucide-react";

interface ItemListProps {
  items: Item[];
  isLoading: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ items, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="glass-card animate-pulse">
            <div className="rounded-lg aspect-square mb-4 bg-muted" />
            <div className="h-5 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-full mb-4" />
            <div className="h-4 bg-muted rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No items found</h3>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first item
        </p>
        
        <Link 
          to="/items/new" 
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Item
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {items.map((item) => (
        <div key={item.id} className="animate-scale-in">
          <ItemCard item={item} />
        </div>
      ))}
    </div>
  );
};

export default ItemList;

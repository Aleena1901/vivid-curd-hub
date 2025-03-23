
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/lib/item-service";
import ItemList from "@/components/ItemList";
import { Link } from "react-router-dom";
import { PlusIcon, SearchIcon } from "lucide-react";

const Items: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: itemService.getItems,
  });
  
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container-page">
        <div className="page-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Items</h1>
            <p className="text-muted-foreground">
              Browse and manage your collection
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search items..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Link to="/items/new" className="btn-primary whitespace-nowrap">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Item
            </Link>
          </div>
        </div>
        
        <ItemList items={filteredItems} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Items;

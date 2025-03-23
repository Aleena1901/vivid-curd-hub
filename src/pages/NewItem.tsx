
import React from "react";
import Layout from "@/components/Layout";
import ItemForm from "@/components/ItemForm";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Item, itemService } from "@/lib/item-service";

const NewItem: React.FC = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (formData: Partial<Item>) => 
      itemService.createItem(formData as Omit<Item, 'id' | 'createdAt'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const handleSubmit = async (formData: Partial<Item>) => {
    await createMutation.mutateAsync(formData);
  };

  return (
    <Layout>
      <div className="container-page">
        <div className="mb-8">
          <Link to="/items" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </div>
        
        <div className="page-header">
          <h1 className="text-3xl font-bold mb-2">Create New Item</h1>
          <p className="text-muted-foreground">
            Add a new item to your collection
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ItemForm 
            onSubmit={handleSubmit} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default NewItem;

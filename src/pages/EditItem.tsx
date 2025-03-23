
import React from "react";
import Layout from "@/components/Layout";
import ItemForm from "@/components/ItemForm";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Item, itemService } from "@/lib/item-service";
import { toast } from "sonner";

const EditItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  const { data: item, isLoading: isItemLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => itemService.getItem(id as string),
    enabled: !!id,
  });
  
  const updateMutation = useMutation({
    mutationFn: (formData: Partial<Item>) => 
      itemService.updateItem(id as string, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", id] });
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const handleSubmit = async (formData: Partial<Item>) => {
    await updateMutation.mutateAsync(formData);
  };

  if (isItemLoading) {
    return (
      <Layout>
        <div className="container-page">
          <div className="animate-pulse max-w-2xl mx-auto">
            <div className="h-6 w-32 bg-muted rounded mb-4" />
            <div className="h-10 w-48 bg-muted rounded mb-8" />
            <div className="glass-card">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-32 w-full bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-10 w-32 bg-muted rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
                <div className="flex justify-end">
                  <div className="h-10 w-32 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="container-page text-center">
          <h2 className="text-2xl font-semibold mb-4">Item not found</h2>
          <p className="text-muted-foreground mb-6">
            The item you're trying to edit doesn't exist or has been removed.
          </p>
          <Link to="/items" className="btn-primary">
            Back to Items
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-page">
        <div className="mb-8">
          <Link to={`/items/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Item Details
          </Link>
        </div>
        
        <div className="page-header">
          <h1 className="text-3xl font-bold mb-2">Edit Item</h1>
          <p className="text-muted-foreground">
            Update the information for {item.name}
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <ItemForm 
            item={item} 
            onSubmit={handleSubmit} 
            isLoading={updateMutation.isPending} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditItem;

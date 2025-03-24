import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemService } from "@/lib/item-service";
import Layout from "@/components/Layout";
import { format } from "date-fns";
import { ArrowLeftIcon, EditIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: item, isLoading, isError } = useQuery({
    queryKey: ["item", id],
    queryFn: () => itemService.getItem(id as string),
    enabled: !!id,
    retry: 1,
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => itemService.deleteItem(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item deleted successfully");
      navigate("/items");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container-page">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-6 w-32 bg-muted rounded mb-4" />
            <div className="h-10 w-64 bg-muted rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square rounded-lg bg-muted" />
              <div className="space-y-4">
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-24 w-full bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (isError || !item) {
    return (
      <Layout>
        <div className="container-page text-center">
          <h2 className="text-2xl font-semibold mb-4">Item not found</h2>
          <p className="text-muted-foreground mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/items" className="btn-primary">
            Back to Items
          </Link>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = format(new Date(item.createdAt), "MMMM d, yyyy");
  
  return (
    <Layout>
      <div className="container-page">
        <div className="mb-8">
          <Link to="/items" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Items
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-fade-in">
          <div className="glass-card overflow-hidden p-0 rounded-2xl aspect-square">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", item.imageUrl);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
            
            <p className="text-lg font-semibold mb-6 text-primary">
              ${item.price.toFixed(2)}
            </p>
            
            <div className="glass-card flex-grow mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{item.description}</p>
              
              <div className="mt-6 pt-6 border-t border-border/40">
                <p className="text-sm text-muted-foreground">
                  Added on {formattedDate}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link
                to={`/items/${item.id}/edit`}
                className="btn-secondary flex-1 justify-center"
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Link>
              
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="btn-ghost flex-1 justify-center text-destructive hover:bg-destructive/10"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the item.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ItemDetail;

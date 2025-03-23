
import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/lib/item-service";
import ItemCard from "@/components/ItemCard";

const Index: React.FC = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: itemService.getItems,
  });

  const featuredItems = items?.slice(0, 3) || [];

  return (
    <Layout>
      <Hero />
      
      <section className="container-page">
        <div className="text-center mb-12">
          <h2 className="mb-4">Featured Items</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of items designed with simplicity and elegance in mind.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-card animate-pulse">
                <div className="rounded-lg aspect-square mb-4 bg-muted" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {featuredItems.map((item) => (
                <div key={item.id} className="animate-scale-in">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/items" className="btn-secondary">
                View All Items
              </Link>
            </div>
          </>
        )}
      </section>
      
      <section className="container-page bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4">Elegance in Simplicity</h2>
          <p className="text-muted-foreground mb-8">
            Our design philosophy is centered around the belief that less is more. We focus on the essential, 
            eliminating the unnecessary to create a refined experience that feels intuitive and beautiful.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Precision", "Clarity", "Purpose"].map((value) => (
              <div key={value} className="glass-card">
                <h3 className="text-xl mb-2">{value}</h3>
                <p className="text-sm text-muted-foreground">
                  Every element serves a purpose and enhances the overall experience.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

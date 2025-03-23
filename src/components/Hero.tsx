
import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/20 -z-10" />
      
      <div className="container-page py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-slide-down">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              Simple • Elegant • Functional
            </span>
          </div>
          
          <h1 className="animate-slide-up mb-6 leading-tight">
            Beautiful interface with elegant design
          </h1>
          
          <p className="text-xl text-foreground/80 mb-10 animate-slide-up animation-delay-100">
            A minimalist application for managing your items with precision and elegance.
            Experience fluid animations and intuitive controls.
          </p>
          
          <div className="animate-fade-in animation-delay-300">
            <Link 
              to="/items" 
              className="btn-primary text-base rounded-full px-8 py-3 shadow-sm"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;

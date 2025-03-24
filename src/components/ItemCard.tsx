
import { Link } from "react-router-dom";
import { Item } from "@/lib/item-service";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <Link 
      to={`/items/${item.id}`}
      className="block h-full"
    >
      <div className="glass-card h-full flex flex-col group">
        <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error("Image failed to load:", item.imageUrl);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
            onLoad={(e) => {
              (e.target as HTMLElement).parentElement?.classList.add("bg-transparent");
              (e.target as HTMLElement).parentElement?.classList.remove("bg-black/5");
              (e.target as HTMLElement).parentElement?.querySelector("div")?.classList.add("hidden");
            }}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold">
              ${item.price.toFixed(2)}
            </span>
            
            <span className="text-xs text-muted-foreground">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;

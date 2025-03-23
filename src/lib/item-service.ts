
export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

// In-memory data store for demo purposes
let items: Item[] = [
  {
    id: "1",
    name: "Minimalist Chair",
    description: "Elegant chair with a sleek design that combines simplicity with comfort. Perfect for modern living spaces.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(2023, 5, 15).toISOString(),
  },
  {
    id: "2",
    name: "Modern Desk Lamp",
    description: "A beautiful desk lamp with adjustable brightness and color temperature. Designed for focus and comfort.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1534073828943-f801091bb18e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(2023, 6, 22).toISOString(),
  },
  {
    id: "3",
    name: "Ceramic Vase",
    description: "Handcrafted ceramic vase with a unique glaze finish. Each piece is one-of-a-kind and perfect for displaying fresh or dried flowers.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    createdAt: new Date(2023, 7, 10).toISOString(),
  },
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated API calls
export const itemService = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    await delay(600);
    return [...items];
  },
  
  // Get a single item by id
  getItem: async (id: string): Promise<Item | undefined> => {
    await delay(400);
    return items.find(item => item.id === id);
  },
  
  // Create a new item
  createItem: async (item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
    await delay(800);
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    items = [...items, newItem];
    return newItem;
  },
  
  // Update an existing item
  updateItem: async (id: string, updatedItem: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item | undefined> => {
    await delay(800);
    
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      ...updatedItem,
    };
    
    items = updatedItems;
    return updatedItems[index];
  },
  
  // Delete an item
  deleteItem: async (id: string): Promise<boolean> => {
    await delay(600);
    
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    items = items.filter(item => item.id !== id);
    return true;
  },
};

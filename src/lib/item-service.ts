
import { createClient } from '@supabase/supabase-js';

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are available
const hasSupabaseCredentials = !!(supabaseUrl && supabaseKey);

if (!hasSupabaseCredentials) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Supabase project settings.');
}

// Create a mock client if credentials are missing, otherwise use real Supabase client
const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Sample data for when Supabase is not configured
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Modern Chair',
    description: 'Elegant and comfortable chair with minimalist design perfect for any room.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Wooden Table',
    description: 'Handcrafted wooden table made from sustainable oak with a natural finish.',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1604074131665-7a4b13870ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Pendant Light',
    description: 'Contemporary pendant light with adjustable height and warm lighting.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    createdAt: new Date().toISOString()
  }
];

// Simulated API calls with fallback to mock data if Supabase is not available
export const itemService = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    if (!supabase) {
      console.log('Using mock data for items');
      return mockItems;
    }
    
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('createdAt', { ascending: false });
      
    if (error) {
      console.error('Error fetching items:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get a single item by id
  getItem: async (id: string): Promise<Item | undefined> => {
    if (!supabase) {
      console.log('Using mock data for item');
      return mockItems.find(item => item.id === id);
    }
    
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching item:', error);
      return undefined;
    }
    
    return data;
  },
  
  // Create a new item
  createItem: async (item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
    if (!supabase) {
      console.log('Using mock data for create item');
      const newItem: Item = {
        ...item,
        id: (mockItems.length + 1).toString(),
        createdAt: new Date().toISOString()
      };
      mockItems.push(newItem);
      return newItem;
    }
    
    const newItem = {
      ...item,
      createdAt: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('items')
      .insert([newItem])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating item:', error);
      throw new Error('Failed to create item');
    }
    
    return data;
  },
  
  // Update an existing item
  updateItem: async (id: string, updatedItem: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item | undefined> => {
    if (!supabase) {
      console.log('Using mock data for update item');
      const index = mockItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockItems[index] = { ...mockItems[index], ...updatedItem };
        return mockItems[index];
      }
      return undefined;
    }
    
    const { data, error } = await supabase
      .from('items')
      .update(updatedItem)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating item:', error);
      return undefined;
    }
    
    return data;
  },
  
  // Delete an item
  deleteItem: async (id: string): Promise<boolean> => {
    if (!supabase) {
      console.log('Using mock data for delete item');
      const index = mockItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockItems.splice(index, 1);
        return true;
      }
      return false;
    }
    
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting item:', error);
      return false;
    }
    
    return true;
  },
};

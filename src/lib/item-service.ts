
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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Simulated API calls
export const itemService = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
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


import { supabase } from '@/integrations/supabase/client';

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

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

// Check if Supabase client is properly connected
console.log('Checking Supabase connection in item-service');

// Function to map Supabase item to our Item interface
const mapSupabaseItemToItem = (supabaseItem: any): Item => {
  return {
    id: supabaseItem.id,
    name: supabaseItem.name || '',
    description: supabaseItem.discription || '', // Note: there's a typo in the DB column name
    price: supabaseItem.price || 0,
    imageUrl: supabaseItem.imageUrl || supabaseItem.imageurl || '', // Handle both cases
    createdAt: supabaseItem.createAt || supabaseItem.createat || new Date().toISOString(), // Note: typo in DB column name
  };
};

// Simulated API calls with fallback to mock data if Supabase is not available
export const itemService = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    try {
      console.log('Fetching items from Supabase');
      const { data, error } = await supabase
        .from('item')
        .select('*')
        .order('createAt', { ascending: false });
        
      if (error) {
        console.error('Error fetching items:', error);
        console.log('Falling back to mock data');
        return mockItems;
      }
      
      console.log('Got items from Supabase:', data);
      // Map the data to our Item interface
      return data ? data.map(mapSupabaseItemToItem) : mockItems;
    } catch (error) {
      console.error('Unexpected error fetching items:', error);
      console.log('Falling back to mock data');
      return mockItems;
    }
  },
  
  // Get a single item by id
  getItem: async (id: string): Promise<Item | undefined> => {
    try {
      console.log('Fetching item from Supabase with id:', id);
      
      // Check if the ID is a simple number (from mock data)
      const mockItem = mockItems.find(item => item.id === id);
      if (/^[1-9]\d*$/.test(id)) {
        console.log('Using mock data for numeric ID:', id);
        return mockItem;
      }
      
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('item')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching item:', error);
        return mockItem; // Fall back to mock item if available
      }
      
      console.log('Got item from Supabase:', data);
      return data ? mapSupabaseItemToItem(data) : undefined;
    } catch (error) {
      console.error('Unexpected error fetching item:', error);
      return mockItems.find(item => item.id === id);
    }
  },
  
  // Create a new item
  createItem: async (item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
    try {
      // Convert our item to match Supabase column names
      const supabaseItem = {
        name: item.name,
        discription: item.description, // Note the typo in DB column name
        price: item.price,
        imageUrl: item.imageUrl,
        createAt: new Date().toISOString(), // Note the typo in DB column name
      };
      
      console.log('Creating item in Supabase:', supabaseItem);
      const { data, error } = await supabase
        .from('item') // Changed from 'items' to 'item'
        .insert([supabaseItem])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating item:', error);
        const mockItem: Item = {
          ...item,
          id: (mockItems.length + 1).toString(),
          createdAt: new Date().toISOString()
        };
        mockItems.push(mockItem);
        return mockItem;
      }
      
      console.log('Item created in Supabase:', data);
      return mapSupabaseItemToItem(data);
    } catch (error) {
      console.error('Unexpected error creating item:', error);
      const mockItem: Item = {
        ...item,
        id: (mockItems.length + 1).toString(),
        createdAt: new Date().toISOString()
      };
      mockItems.push(mockItem);
      return mockItem;
    }
  },
  
  // Update an existing item
  updateItem: async (id: string, updatedItem: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<Item | undefined> => {
    try {
      // Convert our item to match Supabase column names
      const supabaseItem: any = {};
      if (updatedItem.name !== undefined) supabaseItem.name = updatedItem.name;
      if (updatedItem.description !== undefined) supabaseItem.discription = updatedItem.description;
      if (updatedItem.price !== undefined) supabaseItem.price = updatedItem.price;
      if (updatedItem.imageUrl !== undefined) supabaseItem.imageUrl = updatedItem.imageUrl;
      
      console.log('Updating item in Supabase with id:', id, supabaseItem);
      const { data, error } = await supabase
        .from('item') // Changed from 'items' to 'item'
        .update(supabaseItem)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating item:', error);
        const index = mockItems.findIndex(item => item.id === id);
        if (index !== -1) {
          mockItems[index] = { ...mockItems[index], ...updatedItem };
          return mockItems[index];
        }
        return undefined;
      }
      
      console.log('Item updated in Supabase:', data);
      return data ? mapSupabaseItemToItem(data) : undefined;
    } catch (error) {
      console.error('Unexpected error updating item:', error);
      const index = mockItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockItems[index] = { ...mockItems[index], ...updatedItem };
        return mockItems[index];
      }
      return undefined;
    }
  },
  
  // Delete an item
  deleteItem: async (id: string): Promise<boolean> => {
    try {
      console.log('Deleting item from Supabase with id:', id);
      const { error } = await supabase
        .from('item') // Changed from 'items' to 'item'
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting item:', error);
        const index = mockItems.findIndex(item => item.id === id);
        if (index !== -1) {
          mockItems.splice(index, 1);
          return true;
        }
        return false;
      }
      
      console.log('Item deleted from Supabase');
      return true;
    } catch (error) {
      console.error('Unexpected error deleting item:', error);
      const index = mockItems.findIndex(item => item.id === id);
      if (index !== -1) {
        mockItems.splice(index, 1);
        return true;
      }
      return false;
    }
  },
};

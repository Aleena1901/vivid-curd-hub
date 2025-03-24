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

// Simulated API calls with fallback to mock data if Supabase is not available
export const itemService = {
  // Get all items
  getItems: async (): Promise<Item[]> => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) {
        console.error('Error fetching items:', error);
        console.log('Falling back to mock data');
        return mockItems;
      }
      
      return data || mockItems;
    } catch (error) {
      console.error('Unexpected error fetching items:', error);
      console.log('Falling back to mock data');
      return mockItems;
    }
  },
  
  // Get a single item by id
  getItem: async (id: string): Promise<Item | undefined> => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching item:', error);
        return mockItems.find(item => item.id === id);
      }
      
      return data;
    } catch (error) {
      console.error('Unexpected error fetching item:', error);
      return mockItems.find(item => item.id === id);
    }
  },
  
  // Create a new item
  createItem: async (item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
    try {
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
        const mockItem: Item = {
          ...item,
          id: (mockItems.length + 1).toString(),
          createdAt: new Date().toISOString()
        };
        mockItems.push(mockItem);
        return mockItem;
      }
      
      return data;
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
      const { data, error } = await supabase
        .from('items')
        .update(updatedItem)
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
      
      return data;
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
      const { error } = await supabase
        .from('items')
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

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { fetchRestaurants, createRestaurantAPI, updateRestaurantAPI, deleteRestaurantAPI, getActiveRestaurantId, setActiveRestaurantId, removeActiveRestaurantId, getToken } from '../services/api';

export interface Restaurant {
  id: number;
  name: string;
  address: string | null;
  cuisineType: string | null;
  phone: string | null;
  coversPerDay: number;
  ownerId: number;
  role?: string;
  _count?: { ingredients: number; recipes: number; suppliers: number };
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  switchRestaurant: (id: number) => void;
  addRestaurant: (data: { name: string; address?: string; cuisineType?: string; phone?: string; coversPerDay?: number }) => Promise<Restaurant>;
  updateRestaurant: (id: number, data: Partial<{ name: string; address: string; cuisineType: string; phone: string; coversPerDay: number }>) => Promise<void>;
  removeRestaurant: (id: number) => Promise<void>;
  refreshRestaurants: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const stored = getActiveRestaurantId();
    return stored ? parseInt(stored, 10) : null;
  });
  const [loading, setLoading] = useState(true);

  const selectedRestaurant = restaurants.find((r) => r.id === selectedId) || restaurants[0] || null;

  const loadRestaurants = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setRestaurants([]);
      setLoading(false);
      return;
    }
    try {
      const data = await fetchRestaurants();
      setRestaurants(data);
      // Auto-select first restaurant if none selected or current not found
      if (data.length > 0) {
        const stored = getActiveRestaurantId();
        const storedId = stored ? parseInt(stored, 10) : null;
        if (!storedId || !data.find((r: Restaurant) => r.id === storedId)) {
          setSelectedId(data[0].id);
          setActiveRestaurantId(data[0].id);
        }
      } else {
        // No restaurants — clear stale activeRestaurantId from previous user
        removeActiveRestaurantId();
        setSelectedId(null);
      }
    } catch {
      // Not logged in or error — silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRestaurants(); }, [loadRestaurants]);

  const switchRestaurant = useCallback((id: number) => {
    setSelectedId(id);
    setActiveRestaurantId(id);
  }, []);

  const addRestaurant = useCallback(async (data: { name: string; address?: string; cuisineType?: string; phone?: string; coversPerDay?: number }) => {
    const restaurant = await createRestaurantAPI(data);
    await loadRestaurants();
    switchRestaurant(restaurant.id);
    return restaurant;
  }, [loadRestaurants, switchRestaurant]);

  const updateRestaurant = useCallback(async (id: number, data: Partial<{ name: string; address: string; cuisineType: string; phone: string; coversPerDay: number }>) => {
    await updateRestaurantAPI(id, data);
    await loadRestaurants();
  }, [loadRestaurants]);

  const removeRestaurant = useCallback(async (id: number) => {
    await deleteRestaurantAPI(id);
    const remaining = restaurants.filter((r) => r.id !== id);
    if (selectedId === id && remaining.length > 0) {
      switchRestaurant(remaining[0].id);
    }
    await loadRestaurants();
  }, [restaurants, selectedId, loadRestaurants, switchRestaurant]);

  return (
    <RestaurantContext.Provider
      value={{ restaurants, selectedRestaurant, loading, switchRestaurant, addRestaurant, updateRestaurant, removeRestaurant, refreshRestaurants: loadRestaurants }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used inside RestaurantProvider');
  return ctx;
}

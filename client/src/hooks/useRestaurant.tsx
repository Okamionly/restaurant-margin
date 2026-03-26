import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface Restaurant {
  id: string;
  nom: string;
  adresse: string;
  typeCuisine: string;
  telephone: string;
  couvertsJour: number;
  caEstimeMensuel: number;
  recettesCount: number;
  margeMoyenne: number;
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  switchRestaurant: (id: string) => void;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'recettesCount' | 'margeMoyenne' | 'caEstimeMensuel'>) => void;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void;
  removeRestaurant: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

const DEFAULT_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    nom: 'Le Bistrot de Youssef',
    adresse: '25 rue de la Paix, Paris',
    typeCuisine: 'Cuisine française',
    telephone: '01 42 00 00 01',
    couvertsJour: 80,
    caEstimeMensuel: 48000,
    recettesCount: 34,
    margeMoyenne: 72,
  },
  {
    id: 'rest-2',
    nom: 'Chez Youssef - Traiteur',
    adresse: '12 avenue des Champs, Paris',
    typeCuisine: 'Traiteur/événementiel',
    telephone: '01 42 00 00 02',
    couvertsJour: 120,
    caEstimeMensuel: 85000,
    recettesCount: 58,
    margeMoyenne: 68,
  },
];

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(DEFAULT_RESTAURANTS);
  const [selectedId, setSelectedId] = useState<string>(() => {
    return localStorage.getItem('selectedRestaurantId') || DEFAULT_RESTAURANTS[0].id;
  });

  const selectedRestaurant = restaurants.find((r) => r.id === selectedId) || restaurants[0] || null;

  useEffect(() => {
    localStorage.setItem('selectedRestaurantId', selectedId);
  }, [selectedId]);

  const switchRestaurant = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const addRestaurant = useCallback(
    (data: Omit<Restaurant, 'id' | 'recettesCount' | 'margeMoyenne' | 'caEstimeMensuel'>) => {
      const newRestaurant: Restaurant = {
        ...data,
        id: `rest-${Date.now()}`,
        recettesCount: 0,
        margeMoyenne: 0,
        caEstimeMensuel: data.couvertsJour * 20 * 25, // estimation simple
      };
      setRestaurants((prev) => [...prev, newRestaurant]);
      setSelectedId(newRestaurant.id);
    },
    []
  );

  const updateRestaurant = useCallback((id: string, data: Partial<Restaurant>) => {
    setRestaurants((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const removeRestaurant = useCallback(
    (id: string) => {
      setRestaurants((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        if (selectedId === id && filtered.length > 0) {
          setSelectedId(filtered[0].id);
        }
        return filtered;
      });
    },
    [selectedId]
  );

  return (
    <RestaurantContext.Provider
      value={{ restaurants, selectedRestaurant, switchRestaurant, addRestaurant, updateRestaurant, removeRestaurant }}
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

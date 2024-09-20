// app/favorites/page.tsx
"use client";

import { useEffect, useState } from 'react';
import ImageCard from '../../components/ImageCard';

// Rename the type to avoid conflicts
type PixabayImage = {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<PixabayImage[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  return (
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-2xl font-bold mb-4">Favorite Images</h2>
      {favorites.length === 0 ? (
        <p>No favorite images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((image) => (
            <ImageCard key={image.id} image={image} onClick={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}

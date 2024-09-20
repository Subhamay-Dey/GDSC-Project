"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter} from 'next/navigation';

type Image = {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
};

export default function HomePage() {
  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState<string>('aesthetic');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Image[]>([]);

  const router = useRouter();

  const fetchImages = async (searchQuery: string = " ") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=46085962-1140da6affd142ce3fe7d5a3b&q=${searchQuery}&image_type=photo&pretty=true`
      );
      setImages(response.data.hits);
    } catch (err) {
      setError('Failed to load images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(query);
  }, [query]);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = e.currentTarget.querySelector('input')?.value;
    if (searchInput) {
      setQuery(searchInput);
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.setAttribute('download', 'image.jpg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFavorite = (image: Image) => {
    const isFavorite = favorites.some(fav => fav.id === image.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== image.id)
      : [...favorites, image];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    if (isFavorite) {
      toast.error('Removed from favorites!');
    } else {
      toast.success('Added to favorites!');
    }
  };

  const handleNavigateToFavorites = () => {
    router.push('/favorites');
  };

  return (
  <div className="container mx-auto py-10 px-5">

    {/* Toast Container */}
    <ToastContainer />

    <form onSubmit={handleSearch} className="mb-8 flex justify-center">
      <input
        type="text"
        placeholder="Search for images..."
        className="px-4 py-2 border border-gray-300 rounded-l-md w-full sm:w-2/3 md:w-1/2 focus:outline-none"
      />
      <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition">
        Search
      </button>
    </form>

  {error && <p className="text-red-500">{error}</p>}
  {loading && <p>Loading...</p>}

  {favorites.length > 0 && (
    <>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        Favorites <span className="ml-2 text-sm text-gray-600">({favorites.length})</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {favorites.map((image) => (
          <ImageCard key={image.id} image={image} onClick={() => handleImageClick(image)} />
        ))}
      </div>
    </>
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {images.map((image) => (
      <ImageCard key={image.id} image={image} onClick={() => handleImageClick(image)} />
    ))}
  </div>

  {selectedImage && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50" onClick={handleCloseModal}>
      <div className="bg-white p-8 rounded-lg text-center">
        <img src={selectedImage.largeImageURL} alt={selectedImage.tags} className="max-w-full h-[700px] mb-4" />
        <p className="text-gray-800">Tags: {selectedImage.tags}</p>
        <p className="text-gray-600">Author: {selectedImage.user}</p>

        <button
          onClick={() => handleDownload(selectedImage.largeImageURL)}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Download Image
        </button>

        <button
          onClick={() => handleFavorite(selectedImage)}
          className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          {favorites.some(fav => fav.id === selectedImage.id) ? 'Unfavorite' : 'Favorite'}
        </button>
      </div>
    </div>
  )}
</div>

  );
}
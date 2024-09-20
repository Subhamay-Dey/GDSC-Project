"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from '../components/ImageCard';

type Image = {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
};

export default function HomePage() {
  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState<string>('nature');  // Default query is "nature"
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch images from Pixabay API
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

  // Fetch images whenever the query changes
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
      setQuery(searchInput); // Update query state to trigger image fetch
    }
  };

  return (
    <div className="container mx-auto py-10 px-5">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search for images..."
          className="px-4 py-2 border border-gray-300 rounded-l-md w-full sm:w-2/3 md:w-1/2 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onClick={handleImageClick} />
        ))}
      </div>

      {/* Modal for Larger Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          onClick={handleCloseModal}
        >
          <div className="bg-white p-8 rounded-lg text-center">
            <img
              src={selectedImage.largeImageURL}
              alt={selectedImage.tags}
              className="max-w-full h-[700px] mb-4"
            />
            <p className="text-gray-800">Tags: {selectedImage.tags}</p>
            <p className="text-gray-600">Author: {selectedImage.user}</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client"

import React from 'react';

type ImageCardProps = {
  image: {
    id: number;
    webformatURL: string;
    largeImageURL: string;
    tags: string;
    user: string;
  };
  onClick: (image: any) => void;
};

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  return (
    <div
      className="border rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
      onClick={() => onClick(image)}
    >
      <img src={image.webformatURL} alt={image.tags} className="w-full h-48 object-cover" />
      <div className="p-4">
        <p className="text-gray-800 font-medium">Author: {image.user}</p>
        <p className="text-sm text-gray-600">{image.tags}</p>
      </div>
    </div>
  );
};

export default ImageCard;
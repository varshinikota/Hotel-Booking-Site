import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { Radio, RadioGroup } from '@headlessui/react';

const product = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  images: [
    {
      src: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-secondary-product-shot.jpg',
      alt: 'Two each of gray, white, and black shirts laying flat.',
    },
    {
      src: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg',
      alt: 'Model wearing plain black basic tee.',
    },
    // more images...
  ],
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    // more sizes...
  ],
  description: 'The Basic Tee 6-Pack allows you to express your personality with grayscale options.',
  highlights: [
    'Hand cut and sewn locally',
    'Dyed with proprietary colors',
    'Ultra-soft 100% cotton',
  ],
  details: 'Includes two black, two white, and two heather gray Basic Tees.',
};

export default function ProductOverview() {
  const { id } = useParams(); // Get product ID from the URL
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);

  return (
    <div className="bg-white">
      {/* Product overview content goes here */}
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
      {/* Other elements and details */}
    </div>
  );
}

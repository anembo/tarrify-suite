import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function NewProduct() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState('unit');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      name,
      price,
      type,
      description
    });
    router.push('/products');
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md">
        <div className="mb-4">
          <label className="block mb-1 font-bold">Name</label>
          <input
            type="text"
            className="border rounded w-full px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold">Price</label>
          <input
            type="number"
            className="border rounded w-full px-3 py-2"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold">Type</label>
          <select
            className="border rounded w-full px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="unit">Unit</option>
            <option value="kg">Kg</option>
            <option value="m2">m²</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-bold">Description</label>
          <textarea
            className="border rounded w-full px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}

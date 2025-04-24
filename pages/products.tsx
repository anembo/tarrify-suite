import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Product = {
  id: string;
  name: string;
  price: number;
  type: string;
  description?: string;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-900">Products</h2>
        <button
          onClick={() => router.push('/products/new')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-900 text-white">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4">{product.type}</td>
                <td className="py-2 px-4">{product.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

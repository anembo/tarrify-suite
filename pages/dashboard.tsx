import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const projects = [
    { name: 'Patio Installation', date: '03/15/2024' },
    { name: 'Retaining Wall', date: '02/20/2024' },
    { name: 'Walkway', date: '01/10/2024' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold mb-10">Tarrify Suite</h1>
        <nav className="flex flex-col space-y-4">
          <Link href="#" className="hover:text-green-300">📁 Projects</Link>
          <Link href="#" className="bg-orange-600 px-3 py-2 rounded hover:bg-orange-700 text-center">✏️ Create Estimate</Link>
          <Link href="#" className="hover:text-green-300">👤 Clients</Link>
          <Link href="#" className="hover:text-green-300">⚙️ Settings</Link>
        </nav>
        <button onClick={handleLogout} className="mt-auto bg-red-600 hover:bg-red-700 py-2 rounded text-center">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Projects</h2>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">New Estimate</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{project.name}</td>
                  <td className="py-2">{project.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">Clients</h3>
          <div className="bg-white p-4 rounded shadow">Client</div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Settings</h3>
          <div className="bg-white p-4 rounded shadow flex justify-between">
            <span>Language</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </div>
  );
}

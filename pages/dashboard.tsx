import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

interface Estimate {
  id: string;
  name: string;
  date: Timestamp;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Estimate[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });

    fetchEstimates();
    return () => unsubscribe();
  }, []);

  const fetchEstimates = async () => {
    const querySnapshot = await getDocs(collection(db, 'estimates'));
    const estimatesList: Estimate[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      estimatesList.push({
        id: doc.id,
        name: data.projectName || data.name,
        date: data.date,
      });
    });
    setProjects(estimatesList);
  };

  const handleCreateEstimate = () => {
    router.push('/create-estimate');
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Tarrify Suite</h1>
        <nav className="flex flex-col space-y-4">
          <span className="flex items-center gap-2">📁 Projects</span>
          <button
            onClick={handleCreateEstimate}
            className="bg-orange-600 px-3 py-2 rounded hover:bg-orange-700 text-center flex items-center gap-2 justify-center"
          >
            📝 Create Estimate
          </button>
          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 hover:underline text-left"
          >
            📦 Products
          </button>
          <span className="flex items-center gap-2">👤 Clients</span>
          <span className="flex items-center gap-2">⚙️ Settings</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white mt-10 underline"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">Welcome {user?.email}</h2>
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-green-900 text-white">
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="py-2 px-4">{project.name}</td>
                  <td className="py-2 px-4">
                    {project.date?.toDate?.() instanceof Date
                      ? project.date.toDate().toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

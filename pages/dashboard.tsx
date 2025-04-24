import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Image from 'next/image';

type Estimate = {
  name?: string;
  projectName?: string;
  date: any;
};


export default function Dashboard() {
  const router = useRouter();
  const [, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Estimate[]>([]);


  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });

    fetchEstimates();
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleCreateEstimate = async () => {
    try {
      await addDoc(collection(db, "estimates"), {
        name: "New Landscaping Project",
        date: new Date().toLocaleDateString(),
      });
      fetchEstimates();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const fetchEstimates = async () => {
    const querySnapshot = await getDocs(collection(db, "estimates"));
    const estimatesList: { name: string; date: string }[] = [];
    querySnapshot.forEach((doc) => {
      estimatesList.push(doc.data() as { name: string; date: string });
    });
    setProjects(estimatesList);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white flex flex-col p-6">
        <div className="flex items-center gap-2 mb-12">
          <span className="text-3xl">🌳</span>
          <div className="leading-tight">
            <h1 className="text-xl font-bold">Tarrify</h1>
            <span className="text-sm">SUITE</span>
          </div>
        </div>
        <nav className="flex flex-col space-y-4">
          <span className="flex items-center gap-2">📁 Projects</span>
          <button
            onClick={handleCreateEstimate}
            className="bg-orange-600 px-3 py-2 rounded hover:bg-orange-700 text-center flex items-center gap-2 justify-center"
          >
            📝 Create Estimate
          </button>
          <span className="flex items-center gap-2">👤 Clients</span>
          <span className="flex items-center gap-2">⚙️ Settings</span>
        </nav>
        <div className="mt-auto text-sm text-gray-300">
          <p className="mb-4">Poppnir</p>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 py-2 rounded w-full">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-900">Projects</h2>
          <button
            onClick={handleCreateEstimate}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
          >
            New Estimate
          </button>
        </div>

        {/* Decorative Image */}
        <div className="flex justify-center mb-10">
          <Image src="/landscape-placeholder.png" alt="Landscape" width={200} height={100} className="rounded" />
        </div>

        {/* Projects Table */}
        <div className="bg-white p-6 rounded shadow mb-10">
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
            <td className="py-2">{project.projectName || project.name}</td>
           <td className="py-2">
          {project.date && typeof project.date.toDate === 'function'
          ? project.date.toDate().toLocaleDateString()
          : 'No date'}
          </td>
         </tr>
            ))}
        </tbody>

          </table>
        </div>

        {/* Clients */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-green-900">Clients</h3>
          <div className="bg-white p-4 rounded shadow">Client</div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-xl font-bold mb-2 text-green-900">Settings</h3>
          <div className="bg-white p-4 rounded shadow flex justify-between">
            <span>Language</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </div>
  );
}

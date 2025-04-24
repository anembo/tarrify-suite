import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch {
        setError('Invalid email or password.');
     }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch {
        setError('Google sign-in failed.');
     }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleEmailLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Tarrify Suite</h2>
        {error && <p className="mt-4 text-center text-sm">
  Don&apos;t have an account?{' '}
  <Link href="/register" className="text-green-700 hover:underline">Create one</Link>
</p>}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded w-full mb-4"
        >
          Sign In
        </button>

        <button
          type="button"     
          onClick={handleGoogleLogin}
          className="bg-white border text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded w-full flex items-center justify-center"
        >
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} className="mr-2" />
          Continue with Google
        </button>

        <p>
        Don&apos;t have an account? <a href="/register">Create one</a>
    </p>
      </form>
    </div>
  );
}

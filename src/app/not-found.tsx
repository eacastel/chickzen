import Link from "next/link";

export default async function NotFound() {

  return (
<main className="flex flex-col items-center justify-center text-center text-gray-700 px-6 py-20 grow">
      <h1 className="text-6xl font-serif mb-6">404</h1>
      <p className="text-xl mb-4">Oops, that page doesn’t exist.</p>
      <Link
        href="/"
        className="text-blue-600 underline hover:text-blue-800 text-lg"
      >
        Go back home
      </Link>
    </main>
  );
}

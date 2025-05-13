import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-serif mb-6">Thank you for your order!</h1>
      <p className="text-lg text-gray-700 mb-10">
        Your payment was successful. We&apos;re excited to help you craft your perfect pitch.
        You’ll receive an email confirmation shortly.
      </p>
      <Link
        href="/"
        className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
      >
        Return to homepage
      </Link>
    </div>
  );
}

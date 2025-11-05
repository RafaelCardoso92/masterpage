import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#03397a] to-[#022a5c] px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-white/80 mb-6">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white text-[#03397a] font-semibold rounded-lg hover:bg-white/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

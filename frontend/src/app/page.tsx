import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Algonauts 🧑‍🚀</h1>

      <p className="text-slate-400">
        Competitive Programming Club Platform
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          href="/signup"
          className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
        >
          Signup
        </Link>

        <Link
          href="/dashboard"
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}

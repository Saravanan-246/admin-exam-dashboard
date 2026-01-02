import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg text-slate-400 mb-6">Page Not Found</p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

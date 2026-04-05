import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-[#6B7280] dark:text-[#A3A3A3] mb-4">404</h1>
      <p className="text-xl font-semibold text-[#9CA3AF] dark:text-[#737373] mb-2">Page non trouvée</p>
      <p className="text-[#9CA3AF] dark:text-[#737373] mb-6">La page que vous recherchez n'existe pas.</p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
}

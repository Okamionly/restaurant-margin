import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * ErrorState — etat d'erreur de chargement (canon de la passe UX, critere U3).
 *
 * Remplace l'ecran blanc quand un fetch echoue. Composant PUR de presentation :
 * il ne fait AUCUN fetch. Le bouton « Reessayer » appelle la prop `onRetry`, qui
 * doit REUTILISER le handler de chargement existant de l'ecran (ne pas le
 * reecrire). `role="alert"` pour une annonce immediate au lecteur d'ecran.
 */
interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Relance le chargement. Passer le handler de fetch existant de l'ecran. */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function ErrorState({
  title = 'Une erreur est survenue',
  message = 'Impossible de charger les données. Vérifiez votre connexion, puis réessayez.',
  onRetry,
  retryLabel = 'Réessayer',
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-4 py-12 px-4 text-center ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30"
      >
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="font-satoshi text-lg font-bold text-[#111111] dark:text-white">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-[#737373] dark:text-[#A3A3A3]">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="primary"
          size="md"
          onClick={onRetry}
          icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

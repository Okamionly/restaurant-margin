import { Loader2 } from 'lucide-react';

/**
 * LoadingState — etat de chargement accessible (canon de la passe UX, critere U2).
 *
 * Remplace les `<div>Chargement…</div>` nus. Composant PUR de presentation :
 * il n'a AUCUN etat, aucun effet, aucun handler — on le rend conditionnellement
 * a la place du contenu quand `loading === true`. Il ne touche pas la logique.
 *
 * Semantique : `role="status"` + `aria-live="polite"` + `aria-busy` pour que les
 * lecteurs d'ecran annoncent le chargement ; le label est toujours dispo en
 * `sr-only` (annonce meme si masque visuellement).
 */
interface LoadingStateProps {
  /** Texte annonce (lecteur d'ecran) + affiche sous le spinner. Defaut « Chargement… ». */
  label?: string;
  /** Masquer visuellement le label (garde l'annonce sr-only). Defaut false. */
  srOnlyLabel?: boolean;
  /** Espacement vertical du conteneur. Defaut 'md'. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const pad: Record<NonNullable<LoadingStateProps['size']>, string> = {
  sm: 'py-6',
  md: 'py-12',
  lg: 'py-20',
};

export default function LoadingState({
  label = 'Chargement…',
  srOnlyLabel = false,
  size = 'md',
  className = '',
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center gap-3 ${pad[size]} ${className}`}
    >
      <Loader2 className="w-6 h-6 animate-spin text-teal-600" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      {!srOnlyLabel && (
        <span aria-hidden="true" className="text-sm text-[#737373] dark:text-[#A3A3A3]">
          {label}
        </span>
      )}
    </div>
  );
}

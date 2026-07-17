/**
 * Skeleton — placeholders de chargement (canon de la passe UX, critere U2).
 *
 * Composants PURS de presentation, sans etat ni handler. Les blocs `Skeleton`
 * sont decoratifs (`aria-hidden`) : c'est le conteneur `SkeletonList` qui porte
 * la semantique `role="status"` + `aria-live` pour l'annonce lecteur d'ecran.
 * A rendre a la place du contenu tant que `loading === true`, pour que le
 * squelette epouse la forme du contenu final.
 */
interface SkeletonProps {
  /** Classes de taille/forme. Defaut : ligne de texte pleine largeur. */
  className?: string;
}

export default function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[#F3F4F6] dark:bg-[#171717] ${className}`}
    />
  );
}

/** Liste de cartes-squelettes, avec conteneur `status` accessible. */
export function SkeletonList({ rows = 4, className = '' }: { rows?: number; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`space-y-3 ${className}`}
    >
      <span className="sr-only">Chargement…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="animate-pulse rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] p-4"
        >
          <div className="h-4 w-1/3 rounded bg-[#F3F4F6] dark:bg-[#171717]" />
          <div className="mt-3 h-3 w-2/3 rounded bg-[#F3F4F6] dark:bg-[#171717]" />
        </div>
      ))}
    </div>
  );
}

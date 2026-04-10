import { useRef, useCallback } from 'react';
import { useToast } from './useToast';

/**
 * Hook for soft-delete with undo support.
 *
 * Usage:
 *   const { deleteWithUndo } = useUndoDelete();
 *   await deleteWithUndo({
 *     deleteFn: () => deleteRecipe(id),
 *     restoreFn: () => createRecipe(snapshot),
 *     itemLabel: 'Recette "Tarte aux pommes"',
 *     onDeleted: () => loadData(),
 *     onRestored: () => loadData(),
 *   });
 */

interface DeleteWithUndoOptions {
  /** The function that performs the actual delete (API call) */
  deleteFn: () => Promise<void>;
  /** The function that restores the item (re-creates it via API) */
  restoreFn: () => Promise<any>;
  /** Human-readable label for the deleted item */
  itemLabel?: string;
  /** Called after successful delete */
  onDeleted?: () => void;
  /** Called after successful restore (undo) */
  onRestored?: () => void;
}

const UNDO_WINDOW_MS = 5000;

export function useUndoDelete() {
  const { showToast } = useToast();
  const undoRef = useRef<{ cancelled: boolean } | null>(null);

  const deleteWithUndo = useCallback(
    async (options: DeleteWithUndoOptions) => {
      const { deleteFn, restoreFn, itemLabel, onDeleted, onRestored } = options;

      try {
        // Perform the actual delete
        await deleteFn();
      } catch (err) {
        showToast('Erreur lors de la suppression', 'error');
        return;
      }

      // Notify caller that delete succeeded
      onDeleted?.();

      // Track undo state
      const undoState = { cancelled: false };
      undoRef.current = undoState;

      // Show toast with Annuler button
      const label = itemLabel ? `"${itemLabel}" supprime` : 'Element supprime';
      showToast(label, 'success', {
        duration: UNDO_WINDOW_MS,
        action: {
          label: 'Annuler',
          onClick: async () => {
            if (undoState.cancelled) return;
            undoState.cancelled = true;
            try {
              await restoreFn();
              onRestored?.();
              showToast('Restaure avec succes', 'info');
            } catch {
              showToast('Erreur lors de la restauration', 'error');
            }
          },
        },
      });
    },
    [showToast]
  );

  return { deleteWithUndo };
}

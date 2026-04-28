import { useCollaboration, getPageName } from '../hooks/useCollaboration';
import { Pencil } from 'lucide-react';

/**
 * WorkingIndicator — shows "Marie est en train de modifier..."
 * when another user is on the same page.
 * Place at the top of pages like Recipes, Ingredients, etc.
 */
export default function WorkingIndicator() {
  const { usersOnSamePage } = useCollaboration();

  if (usersOnSamePage.length === 0) return null;

  const names = usersOnSamePage.map(u => u.name.split(/[\s._-]+/)[0]); // first names
  const pageName = getPageName(usersOnSamePage[0].page);

  let text: string;
  if (names.length === 1) {
    text = `${names[0]} est en train de modifier...`;
  } else if (names.length === 2) {
    text = `${names[0]} et ${names[1]} sont en train de modifier...`;
  } else {
    text = `${names[0]} et ${names.length - 1} autres sont en train de modifier...`;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-mono-950 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 text-[12px] text-[#6B7280] dark:text-mono-700">
      <div className="flex items-center gap-1.5">
        <Pencil className="w-3.5 h-3.5 animate-pulse" />
        <span>{text}</span>
      </div>
      <span className="text-[10px] text-[#9CA3AF] dark:text-mono-400">
        ({pageName})
      </span>
    </div>
  );
}

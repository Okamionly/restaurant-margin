/**
 * @file client/src/components/ClientMigrationBanner.tsx
 *
 * Displayed on the /clients page when localStorage still contains
 * the legacy 'restaumargin_clients' key. Offers a one-click migration
 * to the DB via POST /api/clients/import, then removes the localStorage
 * key on success.
 */

import { useState } from 'react';
import { CloudUpload, X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { importClients, type ImportClientRow } from '../lib/clientsApi';

// The legacy localStorage key used by the old Clients.tsx
const LEGACY_STORAGE_KEY = 'restaumargin_clients';

interface LegacyClient {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  notes?: string;
  tags?: string[];
  [key: string]: unknown;
}

function parseLegacyClients(): LegacyClient[] {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LegacyClient[];
  } catch {
    return [];
  }
}

function mapLegacyToImportRow(c: LegacyClient): ImportClientRow | null {
  const fullName = [c.prenom, c.nom].filter(Boolean).join(' ').trim();
  if (!fullName) return null;
  return {
    name: fullName,
    email: typeof c.email === 'string' ? c.email : undefined,
    phone: typeof c.telephone === 'string' ? c.telephone : undefined,
    notes: typeof c.notes === 'string' ? c.notes : undefined,
    tags: Array.isArray(c.tags) ? (c.tags as string[]) : [],
  };
}

interface Props {
  onMigrationComplete: () => void;
}

export default function ClientMigrationBanner({ onMigrationComplete }: Props) {
  const legacyClients = parseLegacyClients();

  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  if (dismissed || legacyClients.length === 0) return null;

  async function handleMigrate() {
    setLoading(true);
    setError(null);
    try {
      const rows = legacyClients
        .map(mapLegacyToImportRow)
        .filter((r): r is ImportClientRow => r !== null);

      if (rows.length === 0) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        setDismissed(true);
        return;
      }

      const result = await importClients(rows);
      setSuccess(result.imported);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      setTimeout(() => {
        setDismissed(true);
        onMigrationComplete();
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la migration');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex-1 min-w-0">
          {success !== null ? (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                {success} client{success > 1 ? 's' : ''} migre{success > 1 ? 's' : ''} vers le cloud avec succes.
              </span>
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                {legacyClients.length} client{legacyClients.length > 1 ? 's' : ''} stocke{legacyClients.length > 1 ? 's' : ''} localement
              </p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
                Migrez vos clients vers le cloud pour les retrouver sur tous vos appareils.
              </p>
              {error && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleMigrate}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="h-3.5 w-3.5" />
                  )}
                  {loading ? 'Migration...' : `Migrer ${legacyClients.length} client${legacyClients.length > 1 ? 's' : ''} vers le cloud`}
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="rounded-lg p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                  title="Ignorer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FileText, Search, Plus, Filter, Eye, Download, Send, ArrowRight,
  Trash2, Edit2, CheckCircle, XCircle, Clock, Euro, Copy,
  CreditCard, Building2,
  AlertTriangle, RotateCcw, Receipt, Loader2,
  LayoutGrid, List, ChevronLeft, ChevronRight, Utensils,
  Wine, CakeSlice, Heart, Briefcase, Sparkles, ClipboardList
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';

const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// ── Types ──────────────────────────────────────────────────────────────

type DocType = 'devis' | 'facture' | 'avoir';
type DocStatus = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'paye' | 'en_retard';
type TabId = 'devis' | 'factures' | 'avoirs';
type TVARate = 5.5 | 10 | 20;
type PaymentMode = 'virement' | 'cb' | 'especes' | 'cheque';

interface LigneDevis {
  id: string;
  description: string;
  quantite: number;
  unite: string;
  prixUnitaireHT: number;
  tauxTVA: TVARate;
}

interface ClientInfo {
  nom: string;
  raisonSociale: string;
  adresse: string;
  codePostal: string;
  ville: string;
  email: string;
  telephone: string;
  siret: string;
}

interface DocumentDevis {
  id: string;
  type: DocType;
  numero: string;
  client: ClientInfo;
  lignes: LigneDevis[];
  dateCreation: string;
  dateValidite: string;
  dureeValidite: number;
  conditionsPaiement: string;
  mentionsLegales: string;
  notes: string;
  statut: DocStatus;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  tvaVentilee: Record<string, number>;
  refDevis?: string;
  refFacture?: string;
  datePaiement?: string;
  modePaiement?: PaymentMode;
}

interface EntrepriseInfo {
  nom: string;
  siret: string;
  adresse: string;
  codePostal: string;
  ville: string;
  tvaIntracommunautaire: string;
  telephone: string;
  email: string;
  rcs: string;
  capitalSocial: string;
}

// ── Constants ──────────────────────────────────────────────────────────

const ENTREPRISE: EntrepriseInfo = {
  nom: 'RestauMargin SAS',
  siret: '912 345 678 00012',
  adresse: '15 rue de la Gastronomie',
  codePostal: '75008',
  ville: 'Paris',
  tvaIntracommunautaire: 'FR 12 912345678',
  telephone: '01 23 45 67 89',
  email: 'contact@restaumargin.fr',
  rcs: 'RCS Paris B 912 345 678',
  capitalSocial: '50 000',
};

const STATUS_KEYS: Record<DocStatus, string> = {
  brouillon: 'devis.statusDraft',
  envoye: 'devis.statusSent',
  accepte: 'devis.statusAccepted',
  refuse: 'devis.statusRefused',
  paye: 'devis.statusPaid',
  en_retard: 'devis.statusOverdue',
};

const STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  brouillon: { label: 'Brouillon', bg: 'bg-mono-950 dark:bg-[#171717]', text: 'text-[#6B7280] dark:text-mono-700', icon: Edit2 },
  envoye: { label: 'Envoyé', bg: 'bg-mono-950 dark:bg-mono-50/40', text: 'text-mono-100 dark:text-mono-500', icon: Send },
  accepte: { label: 'Accepté', bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', icon: CheckCircle },
  refuse: { label: 'Refusé', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', icon: XCircle },
  paye: { label: 'Payé', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', icon: CreditCard },
  en_retard: { label: 'En retard', bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', icon: AlertTriangle },
};

const UNITES = ['unité', 'heure', 'jour', 'forfait', 'kg', 'litre', 'personne', 'lot'];

// ── Quote Templates ───────────────────────────────────────────────────

interface QuoteTemplate {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  lignes: Omit<LigneDevis, 'id'>[];
}

const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: 'menu_entreprise',
    label: 'Menu Entreprise',
    icon: Briefcase,
    description: 'Dejeuner ou diner d\'affaires avec menu complet',
    lignes: [
      { description: 'Mise en bouche du Chef', quantite: 1, unite: 'personne', prixUnitaireHT: 8, tauxTVA: 10 },
      { description: 'Entree : Salade de saison', quantite: 1, unite: 'personne', prixUnitaireHT: 14, tauxTVA: 10 },
      { description: 'Plat principal : Filet de boeuf, legumes de saison', quantite: 1, unite: 'personne', prixUnitaireHT: 28, tauxTVA: 10 },
      { description: 'Dessert : Selection patissiere', quantite: 1, unite: 'personne', prixUnitaireHT: 12, tauxTVA: 10 },
      { description: 'Boissons (vin, eau, cafe)', quantite: 1, unite: 'personne', prixUnitaireHT: 18, tauxTVA: 20 },
      { description: 'Service et mise en place', quantite: 1, unite: 'forfait', prixUnitaireHT: 150, tauxTVA: 20 },
    ],
  },
  {
    id: 'cocktail',
    label: 'Cocktail',
    icon: Wine,
    description: 'Cocktail dinatoire avec pieces salees et sucrees',
    lignes: [
      { description: 'Pieces salees (assortiment 8 varietes)', quantite: 1, unite: 'personne', prixUnitaireHT: 22, tauxTVA: 10 },
      { description: 'Pieces sucrees (mignardises)', quantite: 1, unite: 'personne', prixUnitaireHT: 10, tauxTVA: 10 },
      { description: 'Boissons cocktail (champagne, soft, jus)', quantite: 1, unite: 'personne', prixUnitaireHT: 16, tauxTVA: 20 },
      { description: 'Personnel de service (3h)', quantite: 2, unite: 'personne', prixUnitaireHT: 90, tauxTVA: 20 },
      { description: 'Location verrerie et materiel', quantite: 1, unite: 'forfait', prixUnitaireHT: 120, tauxTVA: 20 },
    ],
  },
  {
    id: 'buffet',
    label: 'Buffet',
    icon: CakeSlice,
    description: 'Buffet complet pour evenement (chaud + froid)',
    lignes: [
      { description: 'Buffet froid (charcuterie, crudites, salades)', quantite: 1, unite: 'personne', prixUnitaireHT: 18, tauxTVA: 10 },
      { description: 'Buffet chaud (3 plats)', quantite: 1, unite: 'personne', prixUnitaireHT: 24, tauxTVA: 10 },
      { description: 'Plateau de fromages', quantite: 1, unite: 'personne', prixUnitaireHT: 8, tauxTVA: 10 },
      { description: 'Desserts varies', quantite: 1, unite: 'personne', prixUnitaireHT: 10, tauxTVA: 10 },
      { description: 'Boissons (vin, eau, jus, cafe)', quantite: 1, unite: 'personne', prixUnitaireHT: 14, tauxTVA: 20 },
      { description: 'Mise en place et decoration', quantite: 1, unite: 'forfait', prixUnitaireHT: 200, tauxTVA: 20 },
    ],
  },
  {
    id: 'mariage',
    label: 'Mariage',
    icon: Heart,
    description: 'Formule mariage complete (vin d\'honneur + repas)',
    lignes: [
      { description: 'Vin d\'honneur (champagne, canapes, verrines)', quantite: 1, unite: 'personne', prixUnitaireHT: 28, tauxTVA: 10 },
      { description: 'Menu mariage : Entree gastronomique', quantite: 1, unite: 'personne', prixUnitaireHT: 18, tauxTVA: 10 },
      { description: 'Menu mariage : Plat principal', quantite: 1, unite: 'personne', prixUnitaireHT: 36, tauxTVA: 10 },
      { description: 'Piece montee / Wedding cake', quantite: 1, unite: 'forfait', prixUnitaireHT: 350, tauxTVA: 10 },
      { description: 'Vins de table (blanc + rouge)', quantite: 1, unite: 'personne', prixUnitaireHT: 22, tauxTVA: 20 },
      { description: 'Champagne dessert + brunch', quantite: 1, unite: 'personne', prixUnitaireHT: 12, tauxTVA: 20 },
      { description: 'Personnel de service (soiree complete)', quantite: 5, unite: 'personne', prixUnitaireHT: 180, tauxTVA: 20 },
      { description: 'Location materiel + decoration', quantite: 1, unite: 'forfait', prixUnitaireHT: 500, tauxTVA: 20 },
    ],
  },
];

// ── Status board columns for Kanban ───────────────────────────────────

const KANBAN_STATUSES: DocStatus[] = ['brouillon', 'envoye', 'accepte', 'refuse'];
const KANBAN_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  brouillon: { bg: 'bg-mono-950 dark:bg-[#171717]/50', text: 'text-[#6B7280] dark:text-mono-700', border: 'border-mono-900 dark:border-mono-200', dot: 'bg-[#D1D5DB] dark:bg-mono-400' },
  envoye: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-400' },
  accepte: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800', dot: 'bg-green-400' },
  refuse: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800', dot: 'bg-red-400' },
};

type ViewMode = 'list' | 'kanban';
type WizardStep = 'template' | 'client' | 'lines' | 'extras' | 'preview';

const CONDITIONS_PAIEMENT = [
  'Paiement à réception',
  'Paiement à 30 jours',
  'Paiement à 45 jours',
  'Paiement à 60 jours',
  '50% à la commande, solde à la livraison',
  '30% acompte, 70% à réception',
];

const MENTIONS_LEGALES_DEVIS = `En cas d'acceptation, le présent devis devra être retourné daté et signé avec la mention "Bon pour accord".
Pénalités de retard : 3 fois le taux d'intérêt légal (art. L.441-10 du Code de commerce).
Indemnité forfaitaire pour frais de recouvrement : 40€ (Décret n°2012-1115).
Pas d'escompte pour paiement anticipé.`;

const MENTIONS_LEGALES_FACTURE = `Pénalités de retard : 3 fois le taux d'intérêt légal (art. L.441-10 du Code de commerce).
Indemnité forfaitaire pour frais de recouvrement : 40€ (Décret n°2012-1115).
Pas d'escompte pour paiement anticipé.
TVA acquittée sur les débits.`;

// ── Helpers ────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatEuro(amount: number): string {
  return formatCurrency(amount);
}

function calcLigneTotalHT(ligne: LigneDevis): number {
  return ligne.quantite * ligne.prixUnitaireHT;
}

function calcTotals(lignes: LigneDevis[]): { totalHT: number; totalTVA: number; totalTTC: number; tvaVentilee: Record<string, number> } {
  const tvaVentilee: Record<string, number> = {};
  let totalHT = 0;
  lignes.forEach(l => {
    const ht = calcLigneTotalHT(l);
    totalHT += ht;
    const tvaKey = `${l.tauxTVA}%`;
    tvaVentilee[tvaKey] = (tvaVentilee[tvaKey] || 0) + ht * l.tauxTVA / 100;
  });
  const totalTVA = Object.values(tvaVentilee).reduce((s, v) => s + v, 0);
  return { totalHT, totalTVA, totalTTC: totalHT + totalTVA, tvaVentilee };
}

function emptyLigne(): LigneDevis {
  return { id: generateId(), description: '', quantite: 1, unite: 'unité', prixUnitaireHT: 0, tauxTVA: 20 };
}

function emptyClient(): ClientInfo {
  return { nom: '', raisonSociale: '', adresse: '', codePostal: '', ville: '', email: '', telephone: '', siret: '' };
}

// ── API types ─────────────────────────────────────────────────────────

interface ApiDevisItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ApiDevis {
  id: number;
  number: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  clientAddress: string | null;
  subject: string;
  status: string;
  tvaRate: number;
  totalHT: number;
  totalTTC: number;
  validUntil: string | null;
  notes: string | null;
  createdAt: string;
  items: ApiDevisItem[];
}

function apiDevisToDocument(api: ApiDevis): DocumentDevis {
  const lignes: LigneDevis[] = api.items.map(item => ({
    id: String(item.id),
    description: item.description,
    quantite: item.quantity,
    unite: 'unité',
    prixUnitaireHT: item.unitPrice,
    tauxTVA: (api.tvaRate || 20) as TVARate,
  }));
  const totals = calcTotals(lignes);
  return {
    id: String(api.id),
    type: 'devis',
    numero: api.number,
    client: {
      nom: api.clientName,
      raisonSociale: api.subject || '',
      adresse: api.clientAddress || '',
      codePostal: '',
      ville: '',
      email: api.clientEmail || '',
      telephone: api.clientPhone || '',
      siret: '',
    },
    lignes,
    dateCreation: api.createdAt ? api.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    dateValidite: api.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    dureeValidite: 30,
    conditionsPaiement: 'Paiement à 30 jours',
    mentionsLegales: MENTIONS_LEGALES_DEVIS,
    notes: api.notes || '',
    statut: (api.status === 'draft' ? 'brouillon' : api.status === 'sent' ? 'envoye' : api.status === 'accepted' ? 'accepte' : api.status === 'refused' ? 'refuse' : api.status === 'paid' ? 'paye' : api.status || 'brouillon') as DocStatus,
    totalHT: api.totalHT || totals.totalHT,
    totalTVA: totals.totalTVA,
    totalTTC: api.totalTTC || totals.totalTTC,
    tvaVentilee: totals.tvaVentilee,
  };
}

function documentToApiPayload(doc: {
  client: ClientInfo;
  lignes: LigneDevis[];
  notes: string;
  dureeValidite: number;
  createType?: DocType;
}, tvaRate?: number) {
  return {
    clientName: doc.client.nom || doc.client.raisonSociale,
    clientEmail: doc.client.email || null,
    clientPhone: doc.client.telephone || null,
    clientAddress: [doc.client.adresse, doc.client.codePostal, doc.client.ville].filter(Boolean).join(', ') || null,
    subject: doc.client.raisonSociale || doc.client.nom,
    tvaRate: tvaRate || (doc.lignes[0]?.tauxTVA || 20),
    validUntil: new Date(Date.now() + doc.dureeValidite * 86400000).toISOString().split('T')[0],
    notes: doc.notes || null,
    items: doc.lignes.map(l => ({
      description: l.description,
      quantity: l.quantite,
      unitPrice: l.prixUnitaireHT,
    })),
  };
}

// (mock data removed — starts empty, loaded from API)

// ── Components ─────────────────────────────────────────────────────────

function StatusBadge({ statut, t }: { statut: DocStatus; t: (key: string) => string }) {
  const cfg = STATUS_CONFIG[statut] || STATUS_CONFIG['brouillon'];
  const Icon = cfg.icon;
  const key = STATUS_KEYS[statut] || STATUS_KEYS['brouillon'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {t(key)}
    </span>
  );
}

// ── PDF Preview Component ──────────────────────────────────────────────

function PDFPreview({ doc, entreprise }: { doc: DocumentDevis; entreprise: EntrepriseInfo }) {
  const typeLabel = doc.type === 'devis' ? 'DEVIS' : doc.type === 'facture' ? 'FACTURE' : 'AVOIR';

  return (
    <div className="bg-white text-mono-100 dark:text-white p-8 rounded-lg shadow-inner border border-mono-900 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header bar */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b-4 border-mono-100">
        <div>
          <div className="w-16 h-16 bg-gradient-to-br from-mono-100 to-[#333] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-2">RM</div>
          <div className="font-bold text-base">{entreprise.nom}</div>
          <div className="text-xs text-[#9CA3AF] dark:text-mono-500 space-y-0.5 mt-1">
            <div>{entreprise.adresse}</div>
            <div>{entreprise.codePostal} {entreprise.ville}</div>
            <div>Tél : {entreprise.telephone}</div>
            <div>{entreprise.email}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-mono-100 dark:text-white">{typeLabel}</div>
          <div className="text-lg font-semibold mt-1">{doc.numero}</div>
          <div className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-2">
            <div>Date : {formatDate(doc.dateCreation)}</div>
            {doc.type === 'devis' && <div>Valide jusqu'au : {formatDate(doc.dateValidite)}</div>}
            {doc.refDevis && <div>Réf. devis : {doc.refDevis}</div>}
            {doc.refFacture && <div>Réf. facture : {doc.refFacture}</div>}
          </div>
        </div>
      </div>

      {/* Client info */}
      <div className="bg-[#F9FAFB] rounded-lg p-4 mb-6">
        <div className="text-xs text-[#9CA3AF] dark:text-mono-500 mb-1 uppercase tracking-wider font-semibold">Destinataire</div>
        <div className="font-bold">{doc.client.raisonSociale || doc.client.nom}</div>
        <div className="text-xs text-[#6B7280] dark:text-mono-700 space-y-0.5">
          {doc.client.nom !== doc.client.raisonSociale && <div>{doc.client.nom}</div>}
          <div>{doc.client.adresse}</div>
          <div>{doc.client.codePostal} {doc.client.ville}</div>
          {doc.client.siret && <div>SIRET : {doc.client.siret}</div>}
        </div>
      </div>

      {/* Lines table */}
      <table className="w-full mb-6 text-xs">
        <thead>
          <tr className="bg-mono-100 dark:bg-white text-white dark:text-black">
            <th className="text-left py-2 px-3 rounded-tl-lg">Description</th>
            <th className="text-center py-2 px-2">Qté</th>
            <th className="text-center py-2 px-2">Unité</th>
            <th className="text-right py-2 px-2">P.U. HT</th>
            <th className="text-center py-2 px-2">TVA</th>
            <th className="text-right py-2 px-3 rounded-tr-lg">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {doc.lignes.map((l, i) => (
            <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}>
              <td className="py-2 px-3">{l.description}</td>
              <td className="text-center py-2 px-2">{l.quantite}</td>
              <td className="text-center py-2 px-2">{l.unite}</td>
              <td className="text-right py-2 px-2">{formatEuro(l.prixUnitaireHT)}</td>
              <td className="text-center py-2 px-2">{l.tauxTVA}%</td>
              <td className="text-right py-2 px-3 font-medium">{formatEuro(calcLigneTotalHT(l))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1 text-xs">
          <div className="flex justify-between py-1">
            <span>Total HT</span>
            <span className="font-semibold">{formatEuro(doc.totalHT)}</span>
          </div>
          {Object.entries(doc.tvaVentilee).map(([rate, amount]) => (
            <div key={rate} className="flex justify-between py-1 text-[#9CA3AF] dark:text-mono-500">
              <span>TVA {rate}</span>
              <span>{formatEuro(amount)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 border-t-2 border-mono-100 font-bold text-base text-mono-100 dark:text-white">
            <span>Total TTC</span>
            <span>{formatEuro(doc.totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="border-t border-mono-900 pt-4 space-y-2 text-xs text-[#9CA3AF] dark:text-mono-500">
        <div><span className="font-semibold text-[#9CA3AF] dark:text-mono-500">Conditions de paiement :</span> {doc.conditionsPaiement}</div>
        {doc.type === 'devis' && (
          <div><span className="font-semibold text-[#9CA3AF] dark:text-mono-500">Durée de validité :</span> {doc.dureeValidite} jours</div>
        )}
        {doc.notes && <div><span className="font-semibold text-[#9CA3AF] dark:text-mono-500">Notes :</span> {doc.notes}</div>}
      </div>

      {/* Mentions légales */}
      <div className="mt-6 pt-4 border-t border-mono-900 text-[10px] text-[#9CA3AF] dark:text-mono-500 whitespace-pre-line">
        {doc.mentionsLegales}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[#D1D5DB] text-[9px] text-[#9CA3AF] dark:text-mono-500 text-center">
        {entreprise.nom} - {entreprise.rcs} - Capital social : {entreprise.capitalSocial}€ - SIRET : {entreprise.siret} - TVA : {entreprise.tvaIntracommunautaire}
      </div>

      {/* Signature zone for devis */}
      {doc.type === 'devis' && (
        <div className="mt-6 pt-4 border-t border-dashed border-[#D1D5DB]">
          <div className="text-xs text-[#9CA3AF] dark:text-mono-500 italic">
            Bon pour accord - Date et signature du client :
          </div>
          <div className="h-16 mt-2 border border-dashed border-[#D1D5DB] rounded-lg" />
        </div>
      )}
    </div>
  );
}

// ── Ligne Editor Row ───────────────────────────────────────────────────

function LigneRow({
  ligne, index, onUpdate, onRemove, canRemove
}: {
  ligne: LigneDevis; index: number;
  onUpdate: (id: string, field: keyof LigneDevis, value: any) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  const totalHT = calcLigneTotalHT(ligne);
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-[#F9FAFB] dark:bg-[#171717]/30 group">
      <div className="col-span-12 sm:col-span-4">
        <input
          type="text"
          value={ligne.description}
          onChange={e => onUpdate(ligne.id, 'description', e.target.value)}
          placeholder="Description..."
          className="w-full px-2 py-1.5 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
        />
      </div>
      <div className="col-span-3 sm:col-span-1">
        <input
          type="number"
          value={ligne.quantite}
          min={1}
          onChange={e => onUpdate(ligne.id, 'quantite', Number(e.target.value))}
          className="w-full px-2 py-1.5 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none text-center"
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <select
          value={ligne.unite}
          onChange={e => onUpdate(ligne.id, 'unite', e.target.value)}
          className="w-full px-2 py-1.5 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
        >
          {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div className="col-span-3 sm:col-span-2">
        <div className="relative">
          <input
            type="number"
            value={ligne.prixUnitaireHT}
            min={0}
            step={0.01}
            onChange={e => onUpdate(ligne.id, 'prixUnitaireHT', Number(e.target.value))}
            className="w-full px-2 py-1.5 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none text-right pr-7"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] dark:text-mono-500">€</span>
        </div>
      </div>
      <div className="col-span-3 sm:col-span-1">
        <select
          value={ligne.tauxTVA}
          onChange={e => onUpdate(ligne.id, 'tauxTVA', Number(e.target.value) as TVARate)}
          className="w-full px-1 py-1.5 text-sm rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none text-center"
        >
          <option value={5.5}>5,5%</option>
          <option value={10}>10%</option>
          <option value={20}>20%</option>
        </select>
      </div>
      <div className="col-span-9 sm:col-span-1 text-right text-sm font-semibold text-[#9CA3AF] dark:text-white">
        {formatEuro(totalHT)}
      </div>
      <div className="col-span-3 sm:col-span-1 text-right">
        {canRemove && (
          <button
            onClick={() => onRemove(ligne.id)}
            className="p-1 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Payment Modal ──────────────────────────────────────────────────────

function PaymentModal({ isOpen, onClose, onConfirm, t }: {
  isOpen: boolean; onClose: () => void;
  onConfirm: (date: string, mode: PaymentMode) => void;
  t: (key: string) => string;
}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<PaymentMode>('virement');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('devis.registerPayment')}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">{t('devis.paymentDate')}</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">{t('devis.paymentMode')}</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as PaymentMode)}
            className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
          >
            <option value="virement">{t('devis.bankTransfer')}</option>
            <option value="cb">{t('devis.creditCard')}</option>
            <option value="especes">{t('devis.cash')}</option>
            <option value="cheque">{t('devis.check')}</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors">
            {t('common.cancel')}
          </button>
          <button
            onClick={() => onConfirm(date, mode)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            {t('devis.confirmPayment')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ── Main Page Component ────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════

export default function Devis() {
  const { showToast } = useToast();
  const { t } = useTranslation();

  // ── State ────────────────────────────────────────────────────────────
  const [documents, setDocuments] = useState<DocumentDevis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('devis');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentDevis | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentDevis | null>(null);
  const [paymentDocId, setPaymentDocId] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  // Wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Create form state
  const [createType, setCreateType] = useState<DocType>('devis');
  const [client, setClient] = useState<ClientInfo>(emptyClient());
  const [lignes, setLignes] = useState<LigneDevis[]>([emptyLigne()]);
  const [dureeValidite, setDureeValidite] = useState(30);
  const [conditionsPaiement, setConditionsPaiement] = useState(CONDITIONS_PAIEMENT[1]);
  const [notes, setNotes] = useState('');

  // ── Fetch devis from API ─────────────────────────────────────────────
  const fetchDevis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/devis`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur chargement devis');
      const json: ApiDevis[] = await res.json();
      setDocuments(json.map(apiDevisToDocument));
    } catch {
      setDocuments([]);
      showToast(t('devis.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchDevis(); }, [fetchDevis]);

  // ── Auto-detect "en_retard" (sent > 30 days ago and not paid) ───────
  useEffect(() => {
    if (loading) return;
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    const hasOverdue = documents.some(
      d => d.statut === 'envoye' && new Date(d.dateCreation).getTime() < thirtyDaysAgo
    );
    if (hasOverdue) {
      setDocuments(prev => prev.map(d => {
        if (d.statut === 'envoye' && new Date(d.dateCreation).getTime() < thirtyDaysAgo) {
          return { ...d, statut: 'en_retard' as DocStatus };
        }
        return d;
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); // run once after data loads

  // ── Counters for numbering ───────────────────────────────────────────
  const nextNumber = useCallback((type: DocType): string => {
    const prefix = type === 'devis' ? 'DEV' : type === 'facture' ? 'FAC' : 'AVO';
    const existing = documents.filter(d => d.type === type);
    const num = existing.length + 1;
    return `${prefix}-2026-${String(num).padStart(3, '0')}`;
  }, [documents]);

  // ── Filtered documents ───────────────────────────────────────────────
  const filteredDocs = useMemo(() => {
    const typeFilter: DocType = activeTab === 'devis' ? 'devis' : activeTab === 'factures' ? 'facture' : 'avoir';
    return documents
      .filter(d => d.type === typeFilter)
      .filter(d => statusFilter === 'all' || d.statut === statusFilter)
      .filter(d => {
        if (!search) return true;
        const s = search.toLowerCase();
        return d.numero.toLowerCase().includes(s)
          || d.client.nom.toLowerCase().includes(s)
          || d.client.raisonSociale.toLowerCase().includes(s);
      })
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  }, [documents, activeTab, statusFilter, search]);

  // ── Computed totals for form ─────────────────────────────────────────
  const formTotals = useMemo(() => calcTotals(lignes), [lignes]);

  // ── Actions ──────────────────────────────────────────────────────────

  function resetForm() {
    setClient(emptyClient());
    setLignes([emptyLigne()]);
    setDureeValidite(30);
    setConditionsPaiement(CONDITIONS_PAIEMENT[1]);
    setNotes('');
    setEditingDoc(null);
    setWizardStep('template');
    setSelectedTemplate(null);
  }

  function handleOpenCreate(type: DocType = 'devis') {
    resetForm();
    setCreateType(type);
    setShowCreateModal(true);
  }

  function handleSelectTemplate(templateId: string) {
    const tmpl = QUOTE_TEMPLATES.find(t2 => t2.id === templateId);
    if (tmpl) {
      setSelectedTemplate(templateId);
      setLignes(tmpl.lignes.map(l => ({ ...l, id: generateId() })));
    }
    setWizardStep('client');
  }

  function handleSkipTemplate() {
    setSelectedTemplate(null);
    setLignes([emptyLigne()]);
    setWizardStep('client');
  }

  async function handleSaveDocument() {
    if (!client.nom && !client.raisonSociale) {
      showToast(t('devis.errorClientName'), 'error');
      return;
    }
    if (lignes.some(l => !l.description || l.prixUnitaireHT === 0)) {
      showToast(t('devis.errorCompleteLines'), 'error');
      return;
    }

    setSaving(true);
    const payload = documentToApiPayload({ client, lignes, notes, dureeValidite, createType });

    try {
      if (editingDoc) {
        // PUT update
        const res = await fetch(`${API}/api/devis/${editingDoc.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erreur mise à jour');
        showToast(t('devis.documentUpdated'), 'success');
      } else {
        // POST create
        const res = await fetch(`${API}/api/devis`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erreur création');
        showToast(t('devis.documentCreated'), 'success');
      }

      // Refresh list from API
      await fetchDevis();
      setShowCreateModal(false);
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('devis.saveError');
      showToast(message, 'error');

      // Fallback: save locally if API fails
      const totals = calcTotals(lignes);
      const dateCreation = new Date().toISOString().split('T')[0];

      if (editingDoc) {
        setDocuments(prev => prev.map(d => d.id === editingDoc.id ? {
          ...d, client, lignes, dureeValidite, conditionsPaiement, notes,
          mentionsLegales: createType === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE,
          ...totals,
        } : d));
      } else {
        const newDoc: DocumentDevis = {
          id: generateId(),
          type: createType,
          numero: nextNumber(createType),
          client, lignes, dateCreation,
          dateValidite: new Date(Date.now() + dureeValidite * 86400000).toISOString().split('T')[0],
          dureeValidite, conditionsPaiement,
          mentionsLegales: createType === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE,
          notes, statut: 'brouillon', ...totals, tvaVentilee: totals.tvaVentilee,
        };
        setDocuments(prev => [newDoc, ...prev]);
      }
      setShowCreateModal(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(doc: DocumentDevis) {
    setEditingDoc(doc);
    setCreateType(doc.type);
    setClient(doc.client);
    setLignes(doc.lignes);
    setDureeValidite(doc.dureeValidite);
    setConditionsPaiement(doc.conditionsPaiement);
    setNotes(doc.notes);
    setShowCreateModal(true);
  }

  function handlePreview(doc: DocumentDevis) {
    setPreviewDoc(doc);
    setShowPreviewModal(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer ce document ?')) return;
    try {
      const res = await fetch(`${API}/api/devis/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok || res.status === 204) {
        showToast(t('devis.documentDeleted'), 'info');
        await fetchDevis();
      } else {
        throw new Error('Erreur suppression');
      }
    } catch {
      // Fallback: remove locally
      setDocuments(prev => prev.filter(d => d.id !== id));
      showToast(t('devis.documentDeleted'), 'info');
    }
  }

  async function handleSendEmail(doc: DocumentDevis) {
    setSendingEmailId(doc.id);
    try {
      const clientEmail = doc.client.email;
      if (!clientEmail) {
        showToast(t('devis.errorClientEmail'), 'error');
        setSendingEmailId(null);
        return;
      }

      // Send devis/facture directly to client email
      const contactRes = await fetch(`${API}/api/devis/send-email`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          clientName: doc.client.nom || doc.client.raisonSociale,
          clientEmail,
          documentNumber: doc.numero,
          documentType: doc.type,
          totalHT: doc.totalHT,
          totalTTC: doc.totalTTC,
          items: doc.lignes,
        }),
      });
      if (!contactRes.ok) throw new Error('Erreur envoi email');

      // Update devis status
      try {
        await fetch(`${API}/api/devis/${doc.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ status: 'sent' }),
        });
      } catch { /* continue with local update */ }

      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, statut: 'envoye' as DocStatus } : d));
      showToast(t('devis.sentByEmail'), 'success');
    } catch {
      showToast(t('devis.errorSendEmail'), 'error');
    } finally {
      setSendingEmailId(null);
    }
  }

  function handleDownloadPDF(doc: DocumentDevis) {
    showToast(t('devis.downloading'), 'info');
  }

  function handleConvertToFacture(devis: DocumentDevis) {
    const totals = calcTotals(devis.lignes);
    const facture: DocumentDevis = {
      ...devis,
      id: generateId(),
      type: 'facture',
      numero: nextNumber('facture'),
      dateCreation: new Date().toISOString().split('T')[0],
      dateValidite: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      statut: 'envoye',
      mentionsLegales: MENTIONS_LEGALES_FACTURE,
      refDevis: devis.numero,
      ...totals,
    };
    setDocuments(prev => {
      const updated = prev.map(d => d.id === devis.id ? { ...d, statut: 'accepte' as DocStatus } : d);
      return [facture, ...updated];
    });
    showToast(t('devis.invoiceCreatedFromQuote'), 'success');
    setActiveTab('factures');
  }

  function handleCreateAvoir(facture: DocumentDevis) {
    handleOpenCreate('avoir');
    setClient(facture.client);
    setNotes(`Avoir sur facture ${facture.numero}`);
  }

  async function handleMarkPaid(docId: string, date: string, mode: PaymentMode) {
    try {
      await fetch(`${API}/api/devis/${docId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: 'paid' }),
      });
    } catch { /* continue with local update */ }
    setDocuments(prev => prev.map(d => d.id === docId ? {
      ...d, statut: 'paye' as DocStatus, datePaiement: date, modePaiement: mode,
    } : d));
    setShowPaymentModal(false);
    setPaymentDocId(null);
    showToast(t('devis.invoiceMarkedPaid'), 'success');
  }

  function handleDuplicate(doc: DocumentDevis) {
    const totals = calcTotals(doc.lignes);
    const dup: DocumentDevis = {
      ...doc,
      id: generateId(),
      numero: nextNumber(doc.type),
      dateCreation: new Date().toISOString().split('T')[0],
      dateValidite: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      statut: 'brouillon',
      ...totals,
    };
    setDocuments(prev => [dup, ...prev]);
    showToast(t('devis.duplicated'), 'success');
  }

  function updateLigne(id: string, field: keyof LigneDevis, value: any) {
    setLignes(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  }

  function removeLigne(id: string) {
    setLignes(prev => prev.filter(l => l.id !== id));
  }

  function addLigne() {
    setLignes(prev => [...prev, emptyLigne()]);
  }

  // ── Stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const devis = documents.filter(d => d.type === 'devis');
    const factures = documents.filter(d => d.type === 'facture');
    const enAttente = devis.filter(d => d.statut === 'envoye').reduce((s, d) => s + d.totalTTC, 0);
    const caFacture = factures.reduce((s, d) => s + d.totalTTC, 0);
    const impaye = factures.filter(d => d.statut === 'en_retard').reduce((s, d) => s + d.totalTTC, 0);
    const tauxConversion = devis.length > 0
      ? Math.round((devis.filter(d => d.statut === 'accepte').length / devis.length) * 100)
      : 0;
    return { enAttente, caFacture, impaye, tauxConversion };
  }, [documents]);

  // ── Render ───────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => ({
    devis: documents.filter(d => d.type === 'devis').length,
    factures: documents.filter(d => d.type === 'facture').length,
    avoirs: documents.filter(d => d.type === 'avoir').length,
  }), [documents]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-mono-100 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-mono-950 dark:bg-mono-50/40 rounded-xl">
              <FileText className="w-6 h-6 text-mono-100 dark:text-mono-700" />
            </div>
            {t('devis.title')}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-mono-500 mt-1">
            {t('devis.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          {activeTab === 'devis' && (
            <div className="flex bg-mono-950 dark:bg-[#171717] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white dark:bg-mono-50 text-mono-100 dark:text-white shadow-sm' : 'text-[#9CA3AF] dark:text-mono-500'
                }`}
              >
                <List className="w-4 h-4" /> Liste
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'kanban' ? 'bg-white dark:bg-mono-50 text-mono-100 dark:text-white shadow-sm' : 'text-[#9CA3AF] dark:text-mono-500'
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Kanban
              </button>
            </div>
          )}
          <button
            onClick={() => handleOpenCreate(activeTab === 'avoirs' ? 'avoir' : activeTab === 'factures' ? 'facture' : 'devis')}
            className="flex items-center gap-2 px-4 py-2.5 bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'avoirs' ? t('devis.newCreditNote') : activeTab === 'factures' ? t('devis.newInvoice') : t('devis.newQuote')}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#374151] dark:text-mono-800" />
          <span className="ml-3 text-[#9CA3AF] dark:text-mono-500">{t('devis.loadingDocuments')}</span>
        </div>
      )}

      {!loading && (<>
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('devis.pendingQuotes'), value: formatEuro(stats.enAttente), icon: Clock, color: 'text-mono-100 dark:text-mono-700', bg: 'bg-[#F9FAFB] dark:bg-mono-50/20' },
          { label: t('devis.invoicedRevenue'), value: formatEuro(stats.caFacture), icon: Euro, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: t('devis.unpaid'), value: formatEuro(stats.impaye), icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: t('devis.conversionRate'), value: `${stats.tauxConversion}%`, icon: Receipt, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-mono-900/50 dark:border-mono-200/50`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-mono-500">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs — List view (or always for factures/avoirs) */}
      {(viewMode === 'list' || activeTab !== 'devis') && (
      <div className="bg-white dark:bg-mono-50 rounded-2xl shadow-sm border border-mono-900 dark:border-mono-200 overflow-hidden">
        <div className="flex border-b border-mono-900 dark:border-mono-200">
          {([
            { id: 'devis' as TabId, label: t('devis.tabQuotes'), count: tabCounts.devis },
            { id: 'factures' as TabId, label: t('devis.tabInvoices'), count: tabCounts.factures },
            { id: 'avoirs' as TabId, label: t('devis.tabCreditNotes'), count: tabCounts.avoirs },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setStatusFilter('all'); }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-mono-100 dark:text-mono-700 border-b-2 border-mono-100 dark:border-[#333] bg-[#F9FAFB]/50 dark:bg-mono-50/10'
                  : 'text-[#9CA3AF] dark:text-mono-500 hover:text-[#374151] dark:text-mono-800 dark:hover:text-mono-100 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/50'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-mono-950 dark:bg-mono-50/40 text-mono-100 dark:text-mono-700'
                  : 'bg-mono-950 dark:bg-[#171717] text-[#9CA3AF] dark:text-mono-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-mono-950 dark:border-mono-200/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('devis.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white text-sm focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters
                  ? 'border-[#D1D5DB] dark:border-mono-200 text-mono-100 dark:text-mono-700 bg-[#F9FAFB] dark:bg-mono-50/20'
                  : 'border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-700 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]'
              }`}
            >
              <Filter className="w-4 h-4" />
              {t('devis.filters')}
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-mono-950 dark:border-mono-200/50">
              <span className="text-xs text-[#9CA3AF] dark:text-mono-500 self-center mr-1">{t('devis.status')} :</span>
              {['all', 'brouillon', 'envoye', 'accepte', 'refuse', 'paye', 'en_retard'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as DocStatus | 'all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-mono-100 dark:bg-white text-white dark:text-black'
                      : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 hover:bg-mono-900 dark:hover:bg-[#4B5563]'
                  }`}
                >
                  {s === 'all' ? t('common.all') : t(STATUS_KEYS[s as DocStatus] || STATUS_KEYS['brouillon'])}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-[#6B7280] dark:text-mono-700 mx-auto mb-3" />
              <p className="text-[#9CA3AF] dark:text-mono-500 font-medium">{t('devis.noDocuments')}</p>
              <p className="text-sm text-[#9CA3AF] dark:text-mono-500 mt-1">{t('devis.createFirstDocument')}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] dark:bg-[#171717]/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">{t('devis.colNumber')}</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">{t('devis.colClient')}</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider hidden md:table-cell">{t('devis.colDate')}</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">{t('devis.colAmountHT')}</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider hidden sm:table-cell">{t('devis.colAmountTTC')}</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">{t('devis.status')}</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">{t('devis.colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-950 dark:divide-mono-200/50">
                {filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    className="hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-mono-100 dark:text-white">{doc.numero}</span>
                      {doc.refDevis && (
                        <div className="text-xs text-[#9CA3AF] dark:text-mono-500">Réf: {doc.refDevis}</div>
                      )}
                      {doc.refFacture && (
                        <div className="text-xs text-[#9CA3AF] dark:text-mono-500">Réf: {doc.refFacture}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#1F2937] dark:text-white">{doc.client.raisonSociale || doc.client.nom}</div>
                      <div className="text-xs text-[#9CA3AF] dark:text-mono-500">{doc.client.nom}</div>
                    </td>
                    <td className="py-3 px-4 text-[#6B7280] dark:text-mono-700 hidden md:table-cell">
                      {formatDate(doc.dateCreation)}
                      {doc.datePaiement && (
                        <div className="text-xs text-emerald-500">Payé le {formatDate(doc.datePaiement)}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-mono-100 dark:text-white">
                      {formatEuro(doc.totalHT)}
                    </td>
                    <td className="py-3 px-4 text-right text-[#6B7280] dark:text-mono-700 hidden sm:table-cell">
                      {formatEuro(doc.totalTTC)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge statut={doc.statut} t={t} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handlePreview(doc)} title={t('devis.preview')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white hover:bg-[#F9FAFB] dark:hover:bg-mono-50/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {doc.statut === 'brouillon' && (
                          <button onClick={() => handleEdit(doc)} title={t('devis.edit')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDuplicate(doc)} title={t('devis.duplicate')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        {doc.statut === 'brouillon' && (
                          <button onClick={() => handleSendEmail(doc)} disabled={sendingEmailId === doc.id} title={t('devis.sendByEmail')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white hover:bg-[#F9FAFB] dark:hover:bg-mono-50/20 transition-colors disabled:opacity-50">
                            {sendingEmailId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        )}
                        {doc.type === 'devis' && doc.statut === 'accepte' && (
                          <button
                            onClick={() => handleConvertToFacture(doc)}
                            title={t('devis.convertToInvoice')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            {t('devis.tabInvoices')}
                          </button>
                        )}
                        {doc.type === 'devis' && doc.statut === 'envoye' && (
                          <button onClick={() => handleConvertToFacture(doc)} title={t('devis.convertToInvoice')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {doc.type === 'devis' && doc.statut === 'accepte' && (
                          <button
                            onClick={() => { setPaymentDocId(doc.id); setShowPaymentModal(true); }}
                            title={t('devis.markAsPaid')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            {t('devis.statusPaid')}
                          </button>
                        )}
                        {doc.type === 'facture' && doc.statut !== 'paye' && (
                          <button
                            onClick={() => { setPaymentDocId(doc.id); setShowPaymentModal(true); }}
                            title={t('devis.markAsPaid')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        {doc.type === 'facture' && (
                          <button onClick={() => handleCreateAvoir(doc)} title={t('devis.createCreditNote')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        {doc.statut === 'brouillon' && (
                          <button onClick={() => handleDelete(doc.id)} title={t('devis.delete')} className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-mono-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      )}

      {/* ═══════════ KANBAN VIEW (devis tab only) ═══════════ */}
      {activeTab === 'devis' && viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {KANBAN_STATUSES.map(status => {
            const col = KANBAN_COLORS[status];
            const columnDocs = documents
              .filter(d => d.type === 'devis' && d.statut === status)
              .filter(d => {
                if (!search) return true;
                const s = search.toLowerCase();
                return d.numero.toLowerCase().includes(s) || d.client.nom.toLowerCase().includes(s) || d.client.raisonSociale.toLowerCase().includes(s);
              })
              .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
            return (
              <div key={status} className="flex-shrink-0 w-72">
                {/* Column header */}
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl border ${col.border} ${col.bg}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className={`text-sm font-semibold ${col.text}`}>{t(STATUS_KEYS[status])}</span>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>
                    {columnDocs.length}
                  </span>
                </div>
                {/* Cards */}
                <div className={`border-x border-b ${col.border} rounded-b-xl bg-mono-1000 dark:bg-mono-50/50 p-2 space-y-2 min-h-[240px]`}>
                  {columnDocs.length === 0 && (
                    <div className="text-xs text-[#9CA3AF] dark:text-mono-500 text-center py-10">Aucun devis</div>
                  )}
                  {columnDocs.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => handlePreview(doc)}
                      className="bg-white dark:bg-mono-50 rounded-xl border border-mono-900 dark:border-mono-200 p-3 cursor-pointer hover:shadow-md hover:border-mono-100/30 dark:hover:border-white/30 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-semibold text-[#9CA3AF] dark:text-mono-500">{doc.numero}</span>
                        <span className="text-xs text-[#9CA3AF] dark:text-mono-500">{formatDate(doc.dateCreation)}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-mono-100 dark:text-white truncate">{doc.client.raisonSociale || doc.client.nom}</h4>
                      {doc.client.nom && doc.client.raisonSociale && doc.client.nom !== doc.client.raisonSociale && (
                        <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5 truncate">{doc.client.nom}</p>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-mono-950 dark:border-mono-200/50">
                        <div>
                          <span className="text-xs text-[#9CA3AF] dark:text-mono-500">HT</span>
                          <span className="ml-1 text-sm font-bold text-mono-100 dark:text-white">{formatEuro(doc.totalHT)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-[#9CA3AF] dark:text-mono-500">TTC</span>
                          <span className="ml-1 text-sm font-semibold text-[#6B7280] dark:text-mono-700">{formatEuro(doc.totalTTC)}</span>
                        </div>
                      </div>
                      {/* Quick actions on hover */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e2 => { e2.stopPropagation(); handleEdit(doc); }}
                          className="p-1 rounded text-[#9CA3AF] dark:text-mono-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                          title={t('devis.edit')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e2 => { e2.stopPropagation(); handleSendEmail(doc); }}
                          className="p-1 rounded text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white hover:bg-mono-950 dark:hover:bg-[#171717]"
                          title={t('devis.sendByEmail')}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e2 => { e2.stopPropagation(); handleDuplicate(doc); }}
                          className="p-1 rounded text-[#9CA3AF] dark:text-mono-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          title={t('devis.duplicate')}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {doc.statut === 'brouillon' && (
                          <button
                            onClick={e2 => { e2.stopPropagation(); handleDelete(doc.id); }}
                            className="p-1 rounded text-[#9CA3AF] dark:text-mono-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto"
                            title={t('devis.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      </>)}

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title={editingDoc ? `${t('devis.edit')} ${editingDoc.numero}` : (createType === 'devis' ? t('devis.newQuote') : createType === 'facture' ? t('devis.newInvoice') : t('devis.newCreditNote'))}
        className="max-w-5xl"
      >
        <div className="space-y-6">

          {/* ── Wizard Step Indicator ── */}
          {!editingDoc && createType === 'devis' && (
            <div className="flex items-center gap-2 mb-2">
              {(['template', 'client', 'lines', 'extras', 'preview'] as WizardStep[]).map((step, i) => {
                const labels: Record<WizardStep, string> = { template: 'Template', client: 'Client', lines: 'Lignes', extras: 'Options', preview: 'Apercu' };
                const icons: Record<WizardStep, React.ComponentType<{ className?: string }>> = { template: Sparkles, client: Building2, lines: ClipboardList, extras: FileText, preview: Eye };
                const StepIcon = icons[step];
                const isActive = wizardStep === step;
                const stepOrder: WizardStep[] = ['template', 'client', 'lines', 'extras', 'preview'];
                const isPast = stepOrder.indexOf(step) < stepOrder.indexOf(wizardStep);
                return (
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => isPast && setWizardStep(step)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all w-full justify-center ${
                        isActive
                          ? 'bg-mono-100 dark:bg-white text-white dark:text-black'
                          : isPast
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-mono-950 dark:bg-[#171717] text-[#9CA3AF] dark:text-mono-500'
                      }`}
                    >
                      <StepIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{labels[step]}</span>
                    </button>
                    {i < 4 && <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB] dark:text-mono-400 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Wizard Step: Template Selection ── */}
          {!editingDoc && createType === 'devis' && wizardStep === 'template' && (
            <div>
              <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-1">Choisir un template de devis</h4>
              <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mb-4">Selectionnez un modele pour pre-remplir les lignes, ou partez de zero.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUOTE_TEMPLATES.map(tmpl => {
                  const TmplIcon = tmpl.icon;
                  const templateTotals = calcTotals(tmpl.lignes.map(l => ({ ...l, id: '' })));
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className="text-left p-4 rounded-xl border-2 border-mono-900 dark:border-mono-200 hover:border-mono-100 dark:hover:border-white bg-white dark:bg-mono-50 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-mono-950 dark:bg-[#171717] flex items-center justify-center group-hover:bg-mono-100 dark:group-hover:bg-white transition-colors">
                          <TmplIcon className="w-5 h-5 text-[#6B7280] dark:text-mono-700 group-hover:text-white dark:group-hover:text-black transition-colors" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-mono-100 dark:text-white">{tmpl.label}</h5>
                          <p className="text-xs text-[#9CA3AF] dark:text-mono-500">{tmpl.lignes.length} lignes - {formatEuro(templateTotals.totalTTC)} TTC/pers.</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B7280] dark:text-mono-700">{tmpl.description}</p>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleSkipTemplate}
                className="mt-4 w-full py-3 border-2 border-dashed border-[#D1D5DB] dark:border-[#333] rounded-xl text-sm font-medium text-[#9CA3AF] dark:text-mono-500 hover:border-mono-100 dark:hover:border-white hover:text-mono-100 dark:hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Devis vierge (sans template)
              </button>
            </div>
          )}

          {/* ── Wizard Step: Client (or always show for edit/non-devis) ── */}
          {(editingDoc || createType !== 'devis' || wizardStep === 'client' || wizardStep === 'lines' || wizardStep === 'extras' || wizardStep === 'preview') && wizardStep !== 'template' && (
          <>

          {/* Show entreprise info */}
          {(editingDoc || createType !== 'devis' || wizardStep === 'client') && (
          <div className="bg-[#F9FAFB] dark:bg-mono-50/20 rounded-xl p-4 border border-mono-900 dark:border-mono-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-mono-100 dark:text-mono-700" />
              <span className="text-sm font-semibold text-mono-100 dark:text-mono-500">{t('devis.sender')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-mono-100 dark:text-mono-500">
              <div><span className="font-medium">{ENTREPRISE.nom}</span></div>
              <div>SIRET : {ENTREPRISE.siret}</div>
              <div>{ENTREPRISE.adresse}, {ENTREPRISE.codePostal} {ENTREPRISE.ville}</div>
              <div>TVA : {ENTREPRISE.tvaIntracommunautaire}</div>
            </div>
          </div>
          )}

          {/* Client section — show on client step or always for edit */}
          {(editingDoc || createType !== 'devis' || wizardStep === 'client') && (
          <div>
            <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-mono-500 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {t('devis.clientInfo')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'nom', label: 'Nom du contact', placeholder: 'Jean Martin' },
                { key: 'raisonSociale', label: 'Raison sociale', placeholder: 'TechCorp SAS' },
                { key: 'adresse', label: 'Adresse', placeholder: '123 rue de la Paix' },
                { key: 'codePostal', label: 'Code postal', placeholder: '75001' },
                { key: 'ville', label: 'Ville', placeholder: 'Paris' },
                { key: 'email', label: 'Email', placeholder: 'contact@techcorp.fr' },
                { key: 'telephone', label: 'Téléphone', placeholder: '01 23 45 67 89' },
                { key: 'siret', label: 'SIRET (B2B)', placeholder: '123 456 789 00012' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={(client as any)[field.key]}
                    onChange={e => setClient(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white text-sm focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Wizard nav: client -> lines */}
          {!editingDoc && createType === 'devis' && wizardStep === 'client' && (
            <div className="flex justify-between pt-2">
              <button onClick={() => setWizardStep('template')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
              <button onClick={() => setWizardStep('lines')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors">
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Lignes de devis — show on lines step or always for edit */}
          {(editingDoc || createType !== 'devis' || wizardStep === 'lines' || wizardStep === 'extras' || wizardStep === 'preview') && (<>
          <div>
            <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-mono-500 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('devis.documentLines')}
            </h4>
            <div className="hidden sm:grid grid-cols-12 gap-2 px-2 mb-1">
              <div className="col-span-4 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">Description</div>
              <div className="col-span-1 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium text-center">Qté</div>
              <div className="col-span-2 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium text-center">Unité</div>
              <div className="col-span-2 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium text-right">P.U. HT</div>
              <div className="col-span-1 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium text-center">TVA</div>
              <div className="col-span-1 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium text-right">Total HT</div>
              <div className="col-span-1" />
            </div>
            <div className="space-y-2">
              {lignes.map((ligne, i) => (
                <LigneRow
                  key={ligne.id}
                  ligne={ligne}
                  index={i}
                  onUpdate={updateLigne}
                  onRemove={removeLigne}
                  canRemove={lignes.length > 1}
                />
              ))}
            </div>
            <button
              onClick={addLigne}
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-[#D1D5DB] dark:border-mono-200 text-[#9CA3AF] dark:text-mono-500 hover:border-[#D1D5DB] hover:text-[#333] dark:hover:text-[#E5E5E5] dark:hover:border-[#333] dark:hover:text-[#333] dark:hover:text-[#E5E5E5] transition-colors text-sm font-medium w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              {t('devis.addLine')}
            </button>
          </div>

          {/* Totals — live price calculator */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2 bg-[#F9FAFB] dark:bg-[#171717]/30 rounded-xl p-4 border border-mono-900 dark:border-mono-200">
              <h5 className="text-xs font-bold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5" /> Calcul en direct
              </h5>
              <div className="flex justify-between text-sm">
                <span className="text-[#9CA3AF] dark:text-mono-500">Total HT</span>
                <span className="font-semibold text-mono-100 dark:text-white">{formatEuro(formTotals.totalHT)}</span>
              </div>
              {Object.entries(formTotals.tvaVentilee).map(([rate, amount]) => (
                <div key={rate} className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF] dark:text-mono-500">TVA {rate}</span>
                  <span className="text-[#6B7280] dark:text-mono-700">{formatEuro(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-mono-900 dark:border-mono-200">
                <span className="text-[#9CA3AF] dark:text-white">Total TTC</span>
                <span className="text-mono-100 dark:text-mono-700">{formatEuro(formTotals.totalTTC)}</span>
              </div>
            </div>
          </div>
          </>)}

          {/* Wizard nav: lines -> extras */}
          {!editingDoc && createType === 'devis' && wizardStep === 'lines' && (
            <div className="flex justify-between pt-2">
              <button onClick={() => setWizardStep('client')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
              <button onClick={() => setWizardStep('extras')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors">
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Conditions — show on extras step or always for edit */}
          {(editingDoc || createType !== 'devis' || wizardStep === 'extras' || wizardStep === 'preview') && (<>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {createType === 'devis' && (
              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">{t('devis.validityDuration')}</label>
                <input
                  type="number"
                  value={dureeValidite}
                  min={1}
                  onChange={e => setDureeValidite(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white text-sm focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">{t('devis.paymentTerms')}</label>
              <select
                value={conditionsPaiement}
                onChange={e => setConditionsPaiement(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white text-sm focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none"
              >
                {CONDITIONS_PAIEMENT.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">{t('devis.notes')}</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder={t('devis.notesPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white text-sm focus:ring-2 focus:ring-mono-100 dark:ring-white focus:border-mono-100 outline-none resize-none"
            />
          </div>

          {/* Mentions legales (read-only) */}
          <div className="bg-[#F9FAFB] dark:bg-[#171717]/30 rounded-xl p-4">
            <div className="text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 mb-2">{t('devis.legalNotices')}</div>
            <div className="text-xs text-[#9CA3AF] dark:text-mono-500 whitespace-pre-line">
              {createType === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE}
            </div>
          </div>
          </>)}

          {/* Wizard nav: extras -> preview */}
          {!editingDoc && createType === 'devis' && wizardStep === 'extras' && (
            <div className="flex justify-between pt-2">
              <button onClick={() => setWizardStep('lines')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
              <button onClick={() => setWizardStep('preview')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors">
                Apercu <Eye className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Wizard Step: Preview ── */}
          {!editingDoc && createType === 'devis' && wizardStep === 'preview' && (
            <div>
              <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Apercu du devis
              </h4>
              <PDFPreview
                doc={{
                  id: '', type: 'devis', numero: nextNumber('devis'),
                  client, lignes,
                  dateCreation: new Date().toISOString().split('T')[0],
                  dateValidite: new Date(Date.now() + dureeValidite * 86400000).toISOString().split('T')[0],
                  dureeValidite, conditionsPaiement,
                  mentionsLegales: MENTIONS_LEGALES_DEVIS,
                  notes, statut: 'brouillon',
                  ...formTotals,
                }}
                entreprise={ENTREPRISE}
              />
            </div>
          )}

          {/* Close the outer wizard conditional */}
          </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-mono-900 dark:border-mono-200">
            {!editingDoc && createType === 'devis' && wizardStep === 'preview' && (
              <button onClick={() => setWizardStep('extras')} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors mr-auto">
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
            )}
            <button
              onClick={() => { setShowCreateModal(false); resetForm(); }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
            >
              {t('common.cancel')}
            </button>
            {(editingDoc || createType !== 'devis' || wizardStep === 'preview') && (
            <button
              onClick={handleSaveDocument}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDoc ? t('devis.update') : t('devis.save')}
            </button>
            )}
          </div>
        </div>
      </Modal>

      {/* ── Preview Modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => { setShowPreviewModal(false); setPreviewDoc(null); }}
        title={previewDoc ? `Aperçu - ${previewDoc.numero}` : 'Aperçu'}
        className="max-w-4xl"
      >
        {previewDoc && (
          <div className="space-y-4">
            <PDFPreview doc={previewDoc} entreprise={ENTREPRISE} />
            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-mono-900 dark:border-mono-200">
              {previewDoc.statut === 'brouillon' && (
                <button
                  onClick={() => { handleSendEmail(previewDoc); setShowPreviewModal(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {t('devis.sendByEmail')}
                </button>
              )}
              <button
                onClick={() => handleDownloadPDF(previewDoc)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-mono-950 dark:bg-[#171717] text-[#9CA3AF] dark:text-white hover:bg-mono-900 dark:hover:bg-[#4B5563] transition-colors"
              >
                <Download className="w-4 h-4" />
                {t('devis.downloadPDF')}
              </button>
              {previewDoc.type === 'devis' && (previewDoc.statut === 'accepte' || previewDoc.statut === 'envoye') && (
                <button
                  onClick={() => { handleConvertToFacture(previewDoc); setShowPreviewModal(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  {t('devis.convertToInvoice')}
                </button>
              )}
              {((previewDoc.type === 'facture' && previewDoc.statut !== 'paye') ||
                (previewDoc.type === 'devis' && previewDoc.statut === 'accepte')) && (
                <button
                  onClick={() => {
                    setPaymentDocId(previewDoc.id);
                    setShowPaymentModal(true);
                    setShowPreviewModal(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  {t('devis.markAsPaid')}
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Payment Modal ────────────────────────────────────────────────── */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => { setShowPaymentModal(false); setPaymentDocId(null); }}
        onConfirm={(date, mode) => paymentDocId && handleMarkPaid(paymentDocId, date, mode)}
        t={t}
      />
    </div>
  );
}

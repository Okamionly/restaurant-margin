import { useState, useMemo, useCallback } from 'react';
import {
  FileText, Search, Plus, Filter, Eye, Download, Send, ArrowRight,
  Trash2, Edit2, CheckCircle, XCircle, Clock, Euro, Copy, Printer,
  ChevronDown, ChevronUp, GripVertical, CreditCard, Building2,
  Calendar, AlertTriangle, RotateCcw, Receipt, X as XIcon
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
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

const STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
  brouillon: { label: 'Brouillon', bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300', icon: Edit2 },
  envoye: { label: 'Envoyé', bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', icon: Send },
  accepte: { label: 'Accepté', bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', icon: CheckCircle },
  refuse: { label: 'Refusé', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', icon: XCircle },
  paye: { label: 'Payé', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', icon: CreditCard },
  en_retard: { label: 'En retard', bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', icon: AlertTriangle },
};

const UNITES = ['unité', 'heure', 'jour', 'forfait', 'kg', 'litre', 'personne', 'lot'];

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
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
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

// ── Mock Data ──────────────────────────────────────────────────────────

function buildMockDocuments(): DocumentDevis[] {
  const dev001Lignes: LigneDevis[] = [
    { id: generateId(), description: 'Menu séminaire complet (entrée + plat + dessert)', quantite: 50, unite: 'personne', prixUnitaireHT: 55, tauxTVA: 10 },
    { id: generateId(), description: 'Location salle équipée (vidéoprojecteur, wifi)', quantite: 1, unite: 'jour', prixUnitaireHT: 500, tauxTVA: 20 },
    { id: generateId(), description: 'Pause café matin + après-midi', quantite: 50, unite: 'personne', prixUnitaireHT: 8, tauxTVA: 10 },
  ];

  const dev002Lignes: LigneDevis[] = [
    { id: generateId(), description: 'Cocktail dîner (120 pièces)', quantite: 120, unite: 'personne', prixUnitaireHT: 45, tauxTVA: 10 },
    { id: generateId(), description: 'Pièce montée 5 étages', quantite: 1, unite: 'unité', prixUnitaireHT: 450, tauxTVA: 5.5 },
    { id: generateId(), description: 'Décoration florale tables', quantite: 15, unite: 'unité', prixUnitaireHT: 85, tauxTVA: 20 },
    { id: generateId(), description: 'Service en salle (maîtres d\'hôtel)', quantite: 8, unite: 'personne', prixUnitaireHT: 200, tauxTVA: 20 },
  ];

  const dev003Lignes: LigneDevis[] = [
    { id: generateId(), description: 'Cocktail dînatoire 80 personnes', quantite: 80, unite: 'personne', prixUnitaireHT: 35, tauxTVA: 10 },
  ];

  const fac002Lignes: LigneDevis[] = [
    { id: generateId(), description: 'Menu business déjeuner (entrée + plat + dessert + café)', quantite: 12, unite: 'personne', prixUnitaireHT: 75, tauxTVA: 10 },
    { id: generateId(), description: 'Sélection vins (Bordeaux, Bourgogne)', quantite: 6, unite: 'unité', prixUnitaireHT: 45, tauxTVA: 20 },
    { id: generateId(), description: 'Salon privé', quantite: 1, unite: 'forfait', prixUnitaireHT: 150, tauxTVA: 20 },
  ];

  const avo001Lignes: LigneDevis[] = [
    { id: generateId(), description: 'Avoir partiel - 3 couverts non servis', quantite: 3, unite: 'personne', prixUnitaireHT: -75, tauxTVA: 10 },
    { id: generateId(), description: 'Avoir partiel - 1 bouteille retournée', quantite: 1, unite: 'unité', prixUnitaireHT: -45, tauxTVA: 20 },
  ];

  const docBuilder = (
    type: DocType, numero: string, clientNom: string, raisonSociale: string,
    lignes: LigneDevis[], dateCreation: string, statut: DocStatus,
    opts: Partial<DocumentDevis> = {}
  ): DocumentDevis => {
    const totals = calcTotals(lignes);
    return {
      id: generateId(),
      type, numero,
      client: {
        nom: clientNom, raisonSociale,
        adresse: '123 avenue des Champs', codePostal: '75001', ville: 'Paris',
        email: `contact@${raisonSociale.toLowerCase().replace(/\s/g, '')}.fr`,
        telephone: '01 98 76 54 32',
        siret: '123 456 789 00012',
      },
      lignes, dateCreation,
      dateValidite: new Date(new Date(dateCreation).getTime() + 30 * 86400000).toISOString().split('T')[0],
      dureeValidite: 30,
      conditionsPaiement: 'Paiement à 30 jours',
      mentionsLegales: type === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE,
      notes: '',
      statut,
      ...totals,
      ...opts,
    };
  };

  return [
    docBuilder('devis', 'DEV-2026-001', 'Jean Martin', 'TechCorp', dev001Lignes, '2026-03-01', 'accepte'),
    docBuilder('devis', 'DEV-2026-002', 'Marie Dupont', 'Famille Dupont', dev002Lignes, '2026-03-10', 'envoye'),
    docBuilder('devis', 'DEV-2026-003', 'Pierre Lefebvre', 'Agence Événements Plus', dev003Lignes, '2026-03-20', 'brouillon'),
    docBuilder('facture', 'FAC-2026-001', 'Jean Martin', 'TechCorp', dev001Lignes, '2026-03-05', 'paye', {
      refDevis: 'DEV-2026-001', datePaiement: '2026-03-15', modePaiement: 'virement',
    }),
    docBuilder('facture', 'FAC-2026-002', 'Sophie Bernard', 'Groupe Alpha', fac002Lignes, '2026-02-15', 'en_retard'),
    docBuilder('avoir', 'AVO-2026-001', 'Sophie Bernard', 'Groupe Alpha', avo001Lignes, '2026-03-18', 'envoye', {
      refFacture: 'FAC-2026-002',
    }),
  ];
}

// ── Components ─────────────────────────────────────────────────────────

function StatusBadge({ statut }: { statut: DocStatus }) {
  const cfg = STATUS_CONFIG[statut];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

// ── PDF Preview Component ──────────────────────────────────────────────

function PDFPreview({ doc, entreprise }: { doc: DocumentDevis; entreprise: EntrepriseInfo }) {
  const typeLabel = doc.type === 'devis' ? 'DEVIS' : doc.type === 'facture' ? 'FACTURE' : 'AVOIR';

  return (
    <div className="bg-white text-slate-900 p-8 rounded-lg shadow-inner border border-slate-200 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header bar */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b-4 border-blue-600">
        <div>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-2">RM</div>
          <div className="font-bold text-base">{entreprise.nom}</div>
          <div className="text-xs text-slate-500 space-y-0.5 mt-1">
            <div>{entreprise.adresse}</div>
            <div>{entreprise.codePostal} {entreprise.ville}</div>
            <div>Tél : {entreprise.telephone}</div>
            <div>{entreprise.email}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-700">{typeLabel}</div>
          <div className="text-lg font-semibold mt-1">{doc.numero}</div>
          <div className="text-xs text-slate-500 mt-2">
            <div>Date : {formatDate(doc.dateCreation)}</div>
            {doc.type === 'devis' && <div>Valide jusqu'au : {formatDate(doc.dateValidite)}</div>}
            {doc.refDevis && <div>Réf. devis : {doc.refDevis}</div>}
            {doc.refFacture && <div>Réf. facture : {doc.refFacture}</div>}
          </div>
        </div>
      </div>

      {/* Client info */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Destinataire</div>
        <div className="font-bold">{doc.client.raisonSociale || doc.client.nom}</div>
        <div className="text-xs text-slate-600 space-y-0.5">
          {doc.client.nom !== doc.client.raisonSociale && <div>{doc.client.nom}</div>}
          <div>{doc.client.adresse}</div>
          <div>{doc.client.codePostal} {doc.client.ville}</div>
          {doc.client.siret && <div>SIRET : {doc.client.siret}</div>}
        </div>
      </div>

      {/* Lines table */}
      <table className="w-full mb-6 text-xs">
        <thead>
          <tr className="bg-blue-600 text-white">
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
            <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
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
            <div key={rate} className="flex justify-between py-1 text-slate-500">
              <span>TVA {rate}</span>
              <span>{formatEuro(amount)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 border-t-2 border-blue-600 font-bold text-base text-blue-700">
            <span>Total TTC</span>
            <span>{formatEuro(doc.totalTTC)}</span>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-500">
        <div><span className="font-semibold text-slate-700">Conditions de paiement :</span> {doc.conditionsPaiement}</div>
        {doc.type === 'devis' && (
          <div><span className="font-semibold text-slate-700">Durée de validité :</span> {doc.dureeValidite} jours</div>
        )}
        {doc.notes && <div><span className="font-semibold text-slate-700">Notes :</span> {doc.notes}</div>}
      </div>

      {/* Mentions légales */}
      <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-400 whitespace-pre-line">
        {doc.mentionsLegales}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-300 text-[9px] text-slate-400 text-center">
        {entreprise.nom} - {entreprise.rcs} - Capital social : {entreprise.capitalSocial}€ - SIRET : {entreprise.siret} - TVA : {entreprise.tvaIntracommunautaire}
      </div>

      {/* Signature zone for devis */}
      {doc.type === 'devis' && (
        <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
          <div className="text-xs text-slate-500 italic">
            Bon pour accord - Date et signature du client :
          </div>
          <div className="h-16 mt-2 border border-dashed border-slate-300 rounded-lg" />
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
    <div className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30 group">
      <div className="col-span-12 sm:col-span-4">
        <input
          type="text"
          value={ligne.description}
          onChange={e => onUpdate(ligne.id, 'description', e.target.value)}
          placeholder="Description..."
          className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="col-span-3 sm:col-span-1">
        <input
          type="number"
          value={ligne.quantite}
          min={1}
          onChange={e => onUpdate(ligne.id, 'quantite', Number(e.target.value))}
          className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
        />
      </div>
      <div className="col-span-3 sm:col-span-2">
        <select
          value={ligne.unite}
          onChange={e => onUpdate(ligne.id, 'unite', e.target.value)}
          className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            className="w-full px-2 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right pr-7"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
        </div>
      </div>
      <div className="col-span-3 sm:col-span-1">
        <select
          value={ligne.tauxTVA}
          onChange={e => onUpdate(ligne.id, 'tauxTVA', Number(e.target.value) as TVARate)}
          className="w-full px-1 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center"
        >
          <option value={5.5}>5,5%</option>
          <option value={10}>10%</option>
          <option value={20}>20%</option>
        </select>
      </div>
      <div className="col-span-9 sm:col-span-1 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">
        {formatEuro(totalHT)}
      </div>
      <div className="col-span-3 sm:col-span-1 text-right">
        {canRemove && (
          <button
            onClick={() => onRemove(ligne.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Payment Modal ──────────────────────────────────────────────────────

function PaymentModal({ isOpen, onClose, onConfirm }: {
  isOpen: boolean; onClose: () => void;
  onConfirm: (date: string, mode: PaymentMode) => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<PaymentMode>('virement');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enregistrer le paiement">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date de paiement</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mode de paiement</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as PaymentMode)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="virement">Virement bancaire</option>
            <option value="cb">Carte bancaire</option>
            <option value="especes">Espèces</option>
            <option value="cheque">Chèque</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            Annuler
          </button>
          <button
            onClick={() => onConfirm(date, mode)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Confirmer le paiement
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

  // ── State ────────────────────────────────────────────────────────────
  const [documents, setDocuments] = useState<DocumentDevis[]>(() => buildMockDocuments());
  const [activeTab, setActiveTab] = useState<TabId>('devis');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentDevis | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentDevis | null>(null);
  const [paymentDocId, setPaymentDocId] = useState<string | null>(null);

  // Create form state
  const [createType, setCreateType] = useState<DocType>('devis');
  const [client, setClient] = useState<ClientInfo>(emptyClient());
  const [lignes, setLignes] = useState<LigneDevis[]>([emptyLigne()]);
  const [dureeValidite, setDureeValidite] = useState(30);
  const [conditionsPaiement, setConditionsPaiement] = useState(CONDITIONS_PAIEMENT[1]);
  const [notes, setNotes] = useState('');

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
  }

  function handleOpenCreate(type: DocType = 'devis') {
    resetForm();
    setCreateType(type);
    setShowCreateModal(true);
  }

  function handleSaveDocument() {
    if (!client.nom && !client.raisonSociale) {
      showToast('Veuillez renseigner le nom du client', 'error');
      return;
    }
    if (lignes.some(l => !l.description || l.prixUnitaireHT === 0)) {
      showToast('Veuillez compléter toutes les lignes', 'error');
      return;
    }

    const totals = calcTotals(lignes);
    const dateCreation = new Date().toISOString().split('T')[0];

    if (editingDoc) {
      setDocuments(prev => prev.map(d => d.id === editingDoc.id ? {
        ...d, client, lignes, dureeValidite, conditionsPaiement, notes,
        mentionsLegales: createType === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE,
        ...totals,
      } : d));
      showToast('Document mis à jour avec succès', 'success');
    } else {
      const newDoc: DocumentDevis = {
        id: generateId(),
        type: createType,
        numero: nextNumber(createType),
        client,
        lignes,
        dateCreation,
        dateValidite: new Date(Date.now() + dureeValidite * 86400000).toISOString().split('T')[0],
        dureeValidite,
        conditionsPaiement,
        mentionsLegales: createType === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE,
        notes,
        statut: 'brouillon',
        ...totals,
        tvaVentilee: totals.tvaVentilee,
      };
      setDocuments(prev => [newDoc, ...prev]);
      showToast(`${createType === 'devis' ? 'Devis' : createType === 'facture' ? 'Facture' : 'Avoir'} créé avec succès`, 'success');
    }

    setShowCreateModal(false);
    resetForm();
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

  function handleDelete(id: string) {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast('Document supprimé', 'info');
  }

  function handleSendEmail(doc: DocumentDevis) {
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, statut: 'envoye' as DocStatus } : d));
    showToast(`${doc.numero} envoyé par email à ${doc.client.email}`, 'success');
  }

  function handleDownloadPDF(doc: DocumentDevis) {
    showToast(`Téléchargement de ${doc.numero}.pdf`, 'info');
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
    showToast(`Facture ${facture.numero} créée à partir du devis ${devis.numero}`, 'success');
    setActiveTab('factures');
  }

  function handleCreateAvoir(facture: DocumentDevis) {
    handleOpenCreate('avoir');
    setClient(facture.client);
    setNotes(`Avoir sur facture ${facture.numero}`);
  }

  function handleMarkPaid(docId: string, date: string, mode: PaymentMode) {
    setDocuments(prev => prev.map(d => d.id === docId ? {
      ...d, statut: 'paye' as DocStatus, datePaiement: date, modePaiement: mode,
    } : d));
    setShowPaymentModal(false);
    setPaymentDocId(null);
    showToast('Facture marquée comme payée', 'success');
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
    showToast(`${doc.numero} dupliqué`, 'success');
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            Devis & Factures
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos devis, factures et avoirs en toute conformité
          </p>
        </div>
        <button
          onClick={() => handleOpenCreate(activeTab === 'avoirs' ? 'avoir' : activeTab === 'factures' ? 'facture' : 'devis')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'avoirs' ? 'Nouvel avoir' : activeTab === 'factures' ? 'Nouvelle facture' : 'Nouveau devis'}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Devis en attente', value: formatEuro(stats.enAttente), icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'CA facturé', value: formatEuro(stats.caFacture), icon: Euro, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Impayés', value: formatEuro(stats.impaye), icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: 'Taux de conversion', value: `${stats.tauxConversion}%`, icon: Receipt, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {([
            { id: 'devis' as TabId, label: 'Devis', count: tabCounts.devis },
            { id: 'factures' as TabId, label: 'Factures', count: tabCounts.factures },
            { id: 'avoirs' as TabId, label: 'Avoirs', count: tabCounts.avoirs },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setStatusFilter('all'); }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par numéro, client..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters
                  ? 'border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 dark:text-slate-400 self-center mr-1">Statut :</span>
              {['all', 'brouillon', 'envoye', 'accepte', 'refuse', 'paye', 'en_retard'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as DocStatus | 'all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {s === 'all' ? 'Tous' : STATUS_CONFIG[s as DocStatus].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Aucun document trouvé</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Créez votre premier document</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Numéro</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Montant HT</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Montant TTC</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredDocs.map(doc => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">{doc.numero}</span>
                      {doc.refDevis && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">Réf: {doc.refDevis}</div>
                      )}
                      {doc.refFacture && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">Réf: {doc.refFacture}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{doc.client.raisonSociale || doc.client.nom}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{doc.client.nom}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 hidden md:table-cell">
                      {formatDate(doc.dateCreation)}
                      {doc.datePaiement && (
                        <div className="text-xs text-emerald-500">Payé le {formatDate(doc.datePaiement)}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                      {formatEuro(doc.totalHT)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-300 hidden sm:table-cell">
                      {formatEuro(doc.totalTTC)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge statut={doc.statut} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handlePreview(doc)} title="Aperçu" className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {doc.statut === 'brouillon' && (
                          <button onClick={() => handleEdit(doc)} title="Modifier" className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDuplicate(doc)} title="Dupliquer" className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        {doc.type === 'devis' && (doc.statut === 'accepte' || doc.statut === 'envoye') && (
                          <button onClick={() => handleConvertToFacture(doc)} title="Convertir en facture" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        {doc.type === 'facture' && doc.statut !== 'paye' && (
                          <button
                            onClick={() => { setPaymentDocId(doc.id); setShowPaymentModal(true); }}
                            title="Marquer payé" className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        {doc.type === 'facture' && (
                          <button onClick={() => handleCreateAvoir(doc)} title="Créer un avoir" className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        {doc.statut === 'brouillon' && (
                          <button onClick={() => handleDelete(doc.id)} title="Supprimer" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title={editingDoc ? `Modifier ${editingDoc.numero}` : `Nouveau ${createType === 'devis' ? 'devis' : createType === 'facture' ? 'facture' : 'avoir'}`}
        className="max-w-5xl"
      >
        <div className="space-y-6">
          {/* Entreprise info (auto-filled, read-only summary) */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Émetteur</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-600 dark:text-blue-300">
              <div><span className="font-medium">{ENTREPRISE.nom}</span></div>
              <div>SIRET : {ENTREPRISE.siret}</div>
              <div>{ENTREPRISE.adresse}, {ENTREPRISE.codePostal} {ENTREPRISE.ville}</div>
              <div>TVA : {ENTREPRISE.tvaIntracommunautaire}</div>
            </div>
          </div>

          {/* Client section */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Informations client
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
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={(client as any)[field.key]}
                    onChange={e => setClient(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lignes de devis */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Lignes du document
            </h4>
            <div className="hidden sm:grid grid-cols-12 gap-2 px-2 mb-1">
              <div className="col-span-4 text-xs text-slate-400 font-medium">Description</div>
              <div className="col-span-1 text-xs text-slate-400 font-medium text-center">Qté</div>
              <div className="col-span-2 text-xs text-slate-400 font-medium text-center">Unité</div>
              <div className="col-span-2 text-xs text-slate-400 font-medium text-right">P.U. HT</div>
              <div className="col-span-1 text-xs text-slate-400 font-medium text-center">TVA</div>
              <div className="col-span-1 text-xs text-slate-400 font-medium text-right">Total HT</div>
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
              className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors text-sm font-medium w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              Ajouter une ligne
            </button>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total HT</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatEuro(formTotals.totalHT)}</span>
              </div>
              {Object.entries(formTotals.tvaVentilee).map(([rate, amount]) => (
                <div key={rate} className="flex justify-between text-sm">
                  <span className="text-slate-400">TVA {rate}</span>
                  <span className="text-slate-600 dark:text-slate-300">{formatEuro(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200 dark:border-slate-600">
                <span className="text-slate-700 dark:text-slate-200">Total TTC</span>
                <span className="text-blue-600 dark:text-blue-400">{formatEuro(formTotals.totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {createType === 'devis' && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Durée de validité (jours)</label>
                <input
                  type="number"
                  value={dureeValidite}
                  min={1}
                  onChange={e => setDureeValidite(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Conditions de paiement</label>
              <select
                value={conditionsPaiement}
                onChange={e => setConditionsPaiement(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {CONDITIONS_PAIEMENT.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes additionnelles, informations complémentaires..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Mentions légales (read-only) */}
          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Mentions légales obligatoires (incluses automatiquement)</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-pre-line">
              {createType === 'devis' ? MENTIONS_LEGALES_DEVIS : MENTIONS_LEGALES_FACTURE}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setShowCreateModal(false); resetForm(); }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveDocument}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {editingDoc ? 'Mettre à jour' : 'Enregistrer'}
            </button>
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
            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              {previewDoc.statut === 'brouillon' && (
                <button
                  onClick={() => { handleSendEmail(previewDoc); setShowPreviewModal(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Envoyer par email
                </button>
              )}
              <button
                onClick={() => handleDownloadPDF(previewDoc)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Télécharger PDF
              </button>
              {previewDoc.type === 'devis' && (previewDoc.statut === 'accepte' || previewDoc.statut === 'envoye') && (
                <button
                  onClick={() => { handleConvertToFacture(previewDoc); setShowPreviewModal(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Convertir en facture
                </button>
              )}
              {previewDoc.type === 'facture' && previewDoc.statut !== 'paye' && (
                <button
                  onClick={() => {
                    setPaymentDocId(previewDoc.id);
                    setShowPaymentModal(true);
                    setShowPreviewModal(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Marquer payé
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
      />
    </div>
  );
}

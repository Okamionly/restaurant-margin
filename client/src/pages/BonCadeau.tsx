import { useState, useRef } from 'react';
import { Gift, Download, RotateCcw, Palette } from 'lucide-react';

type Design = 'classic' | 'modern' | 'festive';

interface GiftCard {
  restaurant: string;
  recipient: string;
  sender: string;
  amount: string;
  message: string;
  expiry: string;
  design: Design;
  code: string;
}

function randomCode() {
  return 'GC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

const DESIGNS: { id: Design; label: string; bg: string; accent: string; text: string; border: string }[] = [
  {
    id: 'classic',
    label: 'Classique',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    accent: '#d4a853',
    text: '#ffffff',
    border: '#d4a853',
  },
  {
    id: 'modern',
    label: 'Moderne',
    bg: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
    accent: '#ffffff',
    text: '#ffffff',
    border: 'rgba(255,255,255,0.4)',
  },
  {
    id: 'festive',
    label: 'Festif',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    accent: '#fbbf24',
    text: '#ffffff',
    border: 'rgba(251,191,36,0.5)',
  },
];

const DEFAULT: GiftCard = {
  restaurant: '',
  recipient: '',
  sender: '',
  amount: '50',
  message: 'Profitez d\'une expérience gastronomique inoubliable !',
  expiry: '',
  design: 'classic',
  code: randomCode(),
};

const ic = 'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-[#A3A3A3]';
const lbl = 'block text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1';

export default function BonCadeau() {
  const [card, setCard] = useState<GiftCard>(DEFAULT);
  const previewRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof GiftCard, v: string) => setCard(c => ({ ...c, [k]: v }));
  const reset = () => setCard({ ...DEFAULT, code: randomCode() });

  const d = DESIGNS.find(x => x.id === card.design)!;

  const fmtAmount = (v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    if (isNaN(n)) return v;
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  };

  const handlePrint = () => {
    const printContent = previewRef.current;
    if (!printContent) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bon Cadeau</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  @media print { body { background: white; } @page { size: A5 landscape; margin: 0; } }
</style></head><body>${printContent.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  };

  const expiryLabel = card.expiry
    ? new Date(card.expiry).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
          <Gift className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Générateur de bon cadeau
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">Créez et imprimez un bon cadeau personnalisé</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Form */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-teal-600" /> Design
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {DESIGNS.map(des => (
                <button
                  key={des.id}
                  onClick={() => set('design', des.id)}
                  className={`relative h-16 rounded-xl border-2 transition-all overflow-hidden ${card.design === des.id ? 'ring-2 ring-teal-500' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}
                  style={{ background: des.bg, borderColor: card.design === des.id ? '#0d9488' : undefined }}
                >
                  <span className="text-xs font-medium text-white drop-shadow">{des.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white mb-1">Informations</h2>

            <div>
              <label className={lbl}>Nom du restaurant *</label>
              <input className={ic} placeholder="Le Gourmet Parisien" value={card.restaurant} onChange={e => set('restaurant', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Destinataire</label>
                <input className={ic} placeholder="Marie" value={card.recipient} onChange={e => set('recipient', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Offert par</label>
                <input className={ic} placeholder="Jean" value={card.sender} onChange={e => set('sender', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={lbl}>Montant (€) *</label>
              <input className={ic} type="number" min="1" placeholder="50" value={card.amount} onChange={e => set('amount', e.target.value)} />
            </div>

            <div>
              <label className={lbl}>Message personnalisé</label>
              <textarea className={ic + ' resize-none'} rows={3} placeholder="Votre message..." value={card.message} onChange={e => set('message', e.target.value)} />
            </div>

            <div>
              <label className={lbl}>Valable jusqu'au</label>
              <input className={ic} type="date" value={card.expiry} onChange={e => set('expiry', e.target.value)} />
            </div>

            <div>
              <label className={lbl}>Code unique</label>
              <div className="flex gap-2">
                <input className={ic} value={card.code} onChange={e => set('code', e.target.value)} />
                <button
                  onClick={() => set('code', randomCode())}
                  className="px-3 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-xs text-[#737373] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#333] transition-colors whitespace-nowrap"
                >
                  Nouveau
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              disabled={!card.restaurant || !card.amount}
              className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" /> Imprimer / Enregistrer PDF
            </button>
            <button
              onClick={reset}
              className="px-4 py-3 bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3] rounded-xl hover:bg-[#E5E7EB] dark:hover:bg-[#333] transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          {(!card.restaurant || !card.amount) && (
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] text-center">Renseignez le nom du restaurant et le montant pour activer l'export.</p>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">Aperçu</p>

          <div
            ref={previewRef}
            style={{
              background: d.bg,
              border: `2px solid ${d.border}`,
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              aspectRatio: '1.586',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: `${d.accent}15`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: `${d.accent}10`, pointerEvents: 'none' }} />

            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '10px', color: d.accent, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', fontWeight: 600 }}>BON CADEAU</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: d.text, lineHeight: 1.2 }}>
                  {card.restaurant || 'Nom du restaurant'}
                </div>
              </div>
              <div style={{
                background: d.accent,
                color: d.id === 'classic' ? '#1a1a1a' : (d.id === 'festive' ? '#1a1a1a' : '#0f766e'),
                borderRadius: '12px',
                padding: '8px 14px',
                textAlign: 'center',
                minWidth: '80px',
              }}>
                <div style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{fmtAmount(card.amount)}</div>
                <div style={{ fontSize: '9px', fontWeight: 500, marginTop: '2px', opacity: 0.8 }}>valeur</div>
              </div>
            </div>

            {/* Middle */}
            <div>
              {card.recipient && (
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: `${d.text}99`, textTransform: 'uppercase', letterSpacing: '1px' }}>Pour </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: d.text }}>{card.recipient}</span>
                  {card.sender && (
                    <>
                      <span style={{ fontSize: '10px', color: `${d.text}99` }}> · de la part de </span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: d.text }}>{card.sender}</span>
                    </>
                  )}
                </div>
              )}
              {card.message && (
                <div style={{ fontSize: '12px', color: `${d.text}cc`, fontStyle: 'italic', lineHeight: 1.5, maxWidth: '340px' }}>
                  "{card.message}"
                </div>
              )}
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                {expiryLabel && (
                  <div style={{ fontSize: '9px', color: `${d.text}80`, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Valable jusqu'au {expiryLabel}
                  </div>
                )}
              </div>
              <div style={{
                background: `${d.accent}22`,
                border: `1px solid ${d.accent}44`,
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: d.accent,
                letterSpacing: '2px',
                fontWeight: 700,
              }}>
                {card.code}
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A3A3A3] text-center max-w-xs">
            Cliquez sur "Imprimer / Enregistrer PDF" pour obtenir le fichier. Choisissez "Enregistrer en PDF" dans la boîte de dialogue d'impression.
          </p>
        </div>
      </div>
    </div>
  );
}

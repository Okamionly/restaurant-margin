import { useState, useEffect } from 'react';

type TutorialStep = {
  label: string;
  elements: {
    type: 'sidebar' | 'button' | 'input' | 'card' | 'badge' | 'chart-bar' | 'cursor' | 'toast' | 'modal' | 'text' | 'icon';
    x: number; y: number; w: number; h: number;
    color?: string; text?: string; delay?: number; animate?: 'fadeIn' | 'slideRight' | 'slideUp' | 'pulse' | 'click' | 'type' | 'grow';
  }[];
};

const TUTORIALS: Record<string, { title: string; steps: TutorialStep[] }> = {
  'fiche-technique': {
    title: 'Creer une fiche technique',
    steps: [
      {
        label: 'Cliquez sur "Nouvelle recette"',
        elements: [
          { type: 'sidebar', x: 0, y: 0, w: 60, h: 200, color: '#0A0A0A' },
          { type: 'text', x: 8, y: 20, w: 44, h: 8, text: 'RestauMargin', color: '#0d9488' },
          { type: 'text', x: 8, y: 36, w: 40, h: 6, text: 'Dashboard', color: '#737373' },
          { type: 'text', x: 8, y: 48, w: 40, h: 6, text: 'Recettes', color: '#fff', animate: 'pulse' },
          { type: 'text', x: 8, y: 60, w: 40, h: 6, text: 'Ingredients', color: '#737373' },
          { type: 'button', x: 100, y: 16, w: 80, h: 18, color: '#0d9488', text: '+ Nouvelle recette', animate: 'pulse', delay: 500 },
          { type: 'cursor', x: 140, y: 25, w: 12, h: 12, animate: 'click', delay: 1000 },
        ],
      },
      {
        label: 'Nommez votre recette',
        elements: [
          { type: 'modal', x: 40, y: 10, w: 220, h: 180, color: '#fff' },
          { type: 'text', x: 55, y: 22, w: 100, h: 8, text: 'Nouvelle recette', color: '#111' },
          { type: 'input', x: 55, y: 40, w: 190, h: 16, text: 'Risotto aux cepes', animate: 'type', delay: 300 },
          { type: 'text', x: 55, y: 62, w: 60, h: 6, text: 'Categorie', color: '#737373' },
          { type: 'button', x: 55, y: 72, w: 60, h: 14, color: '#E5E7EB', text: 'Plat' },
          { type: 'text', x: 55, y: 94, w: 60, h: 6, text: 'Prix de vente', color: '#737373' },
          { type: 'input', x: 55, y: 104, w: 80, h: 16, text: '18.50 EUR', animate: 'type', delay: 1500 },
        ],
      },
      {
        label: 'Ajoutez les ingredients',
        elements: [
          { type: 'modal', x: 40, y: 10, w: 220, h: 180, color: '#fff' },
          { type: 'text', x: 55, y: 22, w: 100, h: 8, text: 'Ingredients', color: '#111' },
          { type: 'card', x: 55, y: 38, w: 190, h: 16, color: '#F9FAFB', text: 'Riz arborio — 0.250 kg — 1.20 EUR' },
          { type: 'card', x: 55, y: 58, w: 190, h: 16, color: '#F9FAFB', text: 'Cepes frais — 0.150 kg — 4.50 EUR', animate: 'slideRight', delay: 400 },
          { type: 'card', x: 55, y: 78, w: 190, h: 16, color: '#F9FAFB', text: 'Parmesan — 0.050 kg — 0.90 EUR', animate: 'slideRight', delay: 800 },
          { type: 'card', x: 55, y: 98, w: 190, h: 16, color: '#F9FAFB', text: 'Beurre — 0.030 kg — 0.25 EUR', animate: 'slideRight', delay: 1200 },
          { type: 'button', x: 55, y: 122, w: 80, h: 14, color: '#0d9488', text: '+ Ingredient', animate: 'pulse' },
        ],
      },
      {
        label: 'La marge se calcule automatiquement !',
        elements: [
          { type: 'modal', x: 40, y: 10, w: 220, h: 180, color: '#fff' },
          { type: 'text', x: 55, y: 22, w: 100, h: 8, text: 'Resultat', color: '#111' },
          { type: 'card', x: 55, y: 40, w: 90, h: 40, color: '#F0FDF4', text: 'Cout: 6.85 EUR' },
          { type: 'card', x: 155, y: 40, w: 90, h: 40, color: '#F0FDF4', text: 'Marge: 63%', animate: 'grow', delay: 500 },
          { type: 'chart-bar', x: 55, y: 90, w: 190, h: 50, animate: 'grow', delay: 800 },
          { type: 'badge', x: 100, y: 150, w: 100, h: 20, color: '#059669', text: 'Fiche technique creee !', animate: 'slideUp', delay: 1500 },
        ],
      },
    ],
  },
  'pesee': {
    title: 'Peser un ingredient',
    steps: [
      {
        label: 'Ouvrez la Station Balance',
        elements: [
          { type: 'sidebar', x: 0, y: 0, w: 60, h: 200, color: '#0A0A0A' },
          { type: 'button', x: 8, y: 10, w: 44, h: 16, color: '#0d9488', text: 'Station Balance', animate: 'pulse' },
          { type: 'cursor', x: 30, y: 18, w: 12, h: 12, animate: 'click', delay: 800 },
        ],
      },
      {
        label: 'Selectionnez un ingredient',
        elements: [
          { type: 'card', x: 10, y: 10, w: 80, h: 180, color: '#0A0A0A' },
          { type: 'input', x: 18, y: 18, w: 64, h: 14, text: 'Rechercher...', color: '#171717' },
          { type: 'text', x: 18, y: 40, w: 60, h: 8, text: 'Tomates', color: '#fff', animate: 'pulse', delay: 500 },
          { type: 'text', x: 18, y: 54, w: 60, h: 8, text: 'Poulet', color: '#A3A3A3' },
          { type: 'text', x: 18, y: 68, w: 60, h: 8, text: 'Saumon', color: '#A3A3A3' },
          { type: 'card', x: 110, y: 30, w: 170, h: 120, color: '#111827' },
          { type: 'text', x: 140, y: 50, w: 100, h: 30, text: '0.000', color: '#6B7280' },
          { type: 'text', x: 170, y: 85, w: 30, h: 10, text: 'kg', color: '#6B7280' },
          { type: 'cursor', x: 50, y: 44, w: 12, h: 12, animate: 'click', delay: 1000 },
        ],
      },
      {
        label: 'Posez sur la balance',
        elements: [
          { type: 'card', x: 110, y: 30, w: 170, h: 120, color: '#111827' },
          { type: 'text', x: 120, y: 40, w: 80, h: 8, text: 'Tomates', color: '#10b981' },
          { type: 'text', x: 130, y: 55, w: 120, h: 35, text: '2.450', color: '#10b981', animate: 'grow', delay: 500 },
          { type: 'text', x: 170, y: 92, w: 30, h: 10, text: 'kg', color: '#10b981' },
          { type: 'badge', x: 145, y: 108, w: 60, h: 12, color: '#10b981', text: 'Stable', animate: 'fadeIn', delay: 1200 },
          { type: 'button', x: 140, y: 130, w: 80, h: 18, color: '#059669', text: 'Valider', animate: 'pulse', delay: 1500 },
        ],
      },
    ],
  },
  'commande': {
    title: 'Commander un fournisseur',
    steps: [
      {
        label: 'Ouvrez les commandes',
        elements: [
          { type: 'sidebar', x: 0, y: 0, w: 60, h: 200, color: '#0A0A0A' },
          { type: 'text', x: 8, y: 60, w: 44, h: 6, text: 'Commandes', color: '#fff', animate: 'pulse' },
          { type: 'cursor', x: 30, y: 63, w: 12, h: 12, animate: 'click', delay: 800 },
        ],
      },
      {
        label: 'L\'IA suggere quoi commander',
        elements: [
          { type: 'card', x: 20, y: 10, w: 260, h: 40, color: '#FEF3C7' },
          { type: 'text', x: 30, y: 18, w: 200, h: 8, text: '3 ingredients a commander', color: '#92400E' },
          { type: 'card', x: 20, y: 60, w: 260, h: 24, color: '#FFF', text: 'Tomates — 5 kg — Metro — Urgent' },
          { type: 'card', x: 20, y: 90, w: 260, h: 24, color: '#FFF', text: 'Poulet — 10 kg — Brake — Normal', animate: 'slideRight', delay: 400 },
          { type: 'card', x: 20, y: 120, w: 260, h: 24, color: '#FFF', text: 'Creme — 3 L — Transgourmet', animate: 'slideRight', delay: 800 },
          { type: 'button', x: 100, y: 155, w: 100, h: 18, color: '#25D366', text: 'Commander WhatsApp', animate: 'pulse', delay: 1200 },
        ],
      },
    ],
  },
};

type Props = {
  tutorialId: string;
  onClose: () => void;
};

export default function AnimatedTutorial({ tutorialId, onClose }: Props) {
  const tutorial = TUTORIALS[tutorialId];
  const [stepIdx, setStepIdx] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0);
    const interval = setInterval(() => setTime(t => t + 50), 50);
    return () => clearInterval(interval);
  }, [stepIdx]);

  if (!tutorial) return null;
  const step = tutorial.steps[stepIdx];

  function nextStep() {
    if (stepIdx < tutorial.steps.length - 1) setStepIdx(s => s + 1);
    else onClose();
  }

  function prevStep() {
    if (stepIdx > 0) setStepIdx(s => s - 1);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] w-[340px] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#111111] dark:text-white">{tutorial.title}</h3>
          <span className="text-[10px] text-[#9CA3AF] px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717]">
            {stepIdx + 1}/{tutorial.steps.length}
          </span>
        </div>

        {/* Animation viewport */}
        <div className="relative w-[340px] h-[220px] bg-[#F9FAFB] dark:bg-[#111111] overflow-hidden">
          <svg viewBox="0 0 300 200" className="w-full h-full">
            {step.elements.map((el, i) => {
              const delay = el.delay || 0;
              const visible = time > delay;
              const progress = Math.min(1, Math.max(0, (time - delay) / 600));
              const eased = 1 - Math.pow(1 - progress, 3);

              if (!visible && el.animate !== 'pulse') return null;

              // Cursor
              if (el.type === 'cursor') {
                const bounceY = Math.sin(time / 200) * 2;
                return (
                  <g key={i} opacity={visible ? 1 : 0}>
                    <polygon
                      points={`${el.x},${el.y + bounceY} ${el.x + 10},${el.y + 14 + bounceY} ${el.x + 4},${el.y + 10 + bounceY}`}
                      fill="#111"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    {el.animate === 'click' && visible && (
                      <circle cx={el.x + 2} cy={el.y + 4 + bounceY} r={8 * eased} fill="none" stroke="#0d9488" strokeWidth="2" opacity={1 - eased} />
                    )}
                  </g>
                );
              }

              // Sidebar
              if (el.type === 'sidebar') {
                return (
                  <rect key={i} x={el.x} y={el.y} width={el.w} height={el.h} rx="0" fill={el.color || '#0A0A0A'} />
                );
              }

              // Modal
              if (el.type === 'modal') {
                return (
                  <g key={i} opacity={eased}>
                    <rect x={el.x} y={el.y} width={el.w} height={el.h} rx="8" fill="#fff" stroke="#E5E7EB" strokeWidth="1" />
                  </g>
                );
              }

              // Button
              if (el.type === 'button') {
                const pulse = el.animate === 'pulse' ? 0.8 + Math.sin(time / 300) * 0.2 : 1;
                return (
                  <g key={i} opacity={eased * pulse}>
                    <rect x={el.x} y={el.y} width={el.w} height={el.h} rx="6" fill={el.color || '#0d9488'} />
                    <text x={el.x + el.w / 2} y={el.y + el.h / 2 + 3} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="600">{el.text}</text>
                  </g>
                );
              }

              // Input
              if (el.type === 'input') {
                const chars = el.animate === 'type' ? Math.floor(((el.text || '').length) * eased) : (el.text || '').length;
                const displayText = (el.text || '').slice(0, chars);
                return (
                  <g key={i} opacity={visible ? 1 : 0}>
                    <rect x={el.x} y={el.y} width={el.w} height={el.h} rx="4" fill={el.color || '#F3F4F6'} stroke="#E5E7EB" strokeWidth="0.5" />
                    <text x={el.x + 6} y={el.y + el.h / 2 + 3} fill="#111" fontSize="7" fontWeight="500">{displayText}</text>
                    {el.animate === 'type' && chars < (el.text || '').length && (
                      <rect x={el.x + 6 + chars * 4} y={el.y + 4} width="1" height={el.h - 8} fill="#0d9488" opacity={Math.sin(time / 150) > 0 ? 1 : 0} />
                    )}
                  </g>
                );
              }

              // Card
              if (el.type === 'card') {
                const slideX = el.animate === 'slideRight' ? (1 - eased) * 30 : 0;
                return (
                  <g key={i} opacity={eased} transform={`translate(${slideX}, 0)`}>
                    <rect x={el.x} y={el.y} width={el.w} height={el.h} rx="5" fill={el.color || '#F9FAFB'} stroke="#E5E7EB" strokeWidth="0.5" />
                    {el.text && <text x={el.x + 8} y={el.y + el.h / 2 + 3} fill="#333" fontSize="6" fontWeight="500">{el.text}</text>}
                  </g>
                );
              }

              // Badge
              if (el.type === 'badge') {
                const slideY = el.animate === 'slideUp' ? (1 - eased) * 20 : 0;
                return (
                  <g key={i} opacity={eased} transform={`translate(0, ${slideY})`}>
                    <rect x={el.x} y={el.y} width={el.w} height={el.h} rx="10" fill={el.color || '#059669'} />
                    <text x={el.x + el.w / 2} y={el.y + el.h / 2 + 3} textAnchor="middle" fill="#fff" fontSize="6" fontWeight="700">{el.text}</text>
                  </g>
                );
              }

              // Chart bars
              if (el.type === 'chart-bar') {
                const bars = [0.6, 0.8, 0.45, 0.9, 0.7, 0.55];
                const barW = el.w / bars.length - 4;
                return (
                  <g key={i} opacity={eased}>
                    {bars.map((val, bi) => {
                      const barH = val * el.h * (el.animate === 'grow' ? eased : 1);
                      return (
                        <rect
                          key={bi}
                          x={el.x + bi * (barW + 4)}
                          y={el.y + el.h - barH}
                          width={barW}
                          height={barH}
                          rx="2"
                          fill={val > 0.7 ? '#059669' : val > 0.5 ? '#D97706' : '#DC2626'}
                          opacity={0.8}
                        />
                      );
                    })}
                  </g>
                );
              }

              // Text
              if (el.type === 'text') {
                const pulse = el.animate === 'pulse' ? 0.7 + Math.sin(time / 300) * 0.3 : 1;
                const growScale = el.animate === 'grow' ? eased : 1;
                return (
                  <text
                    key={i}
                    x={el.x}
                    y={el.y + (el.h || 8)}
                    fill={el.color || '#111'}
                    fontSize={Math.min(el.h || 8, 24) * growScale}
                    fontWeight="600"
                    opacity={eased * pulse}
                  >
                    {el.text}
                  </text>
                );
              }

              return null;
            })}
          </svg>
        </div>

        {/* Step label */}
        <div className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#171717] border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
          <p className="text-xs font-medium text-[#111111] dark:text-white text-center">{step.label}</p>
        </div>

        {/* Progress + nav */}
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={stepIdx === 0}
            className="text-xs font-medium text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white disabled:opacity-30 transition-colors"
          >
            Precedent
          </button>
          <div className="flex gap-1.5">
            {tutorial.steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === stepIdx ? 'bg-teal-500' : i < stepIdx ? 'bg-teal-300' : 'bg-[#E5E7EB] dark:bg-[#1A1A1A]'}`} />
            ))}
          </div>
          <button
            onClick={nextStep}
            className="text-xs font-semibold text-teal-600 hover:text-teal-500 transition-colors"
          >
            {stepIdx === tutorial.steps.length - 1 ? 'Terminer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { TUTORIALS };

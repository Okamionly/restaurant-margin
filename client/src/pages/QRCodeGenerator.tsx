import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download, Copy, Check, QrCode, ArrowRight, ChefHat } from 'lucide-react';

const SIZES = [
  { label: '128 px', value: 128 },
  { label: '256 px', value: 256 },
  { label: '512 px', value: 512 },
];

const COLORS = [
  { label: 'Noir', value: '000000', bg: '#000000' },
  { label: 'Teal', value: '0d9488', bg: '#0d9488' },
  { label: 'Bleu', value: '2563eb', bg: '#2563eb' },
];

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('000000');
  const [copied, setCopied] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    document.title = 'Générateur de QR Code Menu Restaurant Gratuit | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Generez un QR code gratuit pour le menu de votre restaurant. Choisissez la taille et la couleur, telechargez en PNG. Outil 100% gratuit par RestauMargin.'
      );
    }
  }, []);

  const qrUrl =
    url.trim().length > 0
      ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url.trim())}&color=${color}`
      : '';

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `qrcode-menu-${size}px.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch {
      // fallback : ouvrir l'image directement
      window.open(qrUrl, '_blank');
    }
  };

  const handleCopy = async () => {
    if (!url.trim()) return;
    try {
      await navigator.clipboard.writeText(url.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafb]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2 text-teal-600 font-bold text-lg" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
            <ChefHat className="w-6 h-6" />
            RestauMargin
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition"
          >
            Connexion
          </Link>
        </div>
      </nav>

      {/* ── Hero / H1 ── */}
      <header className="bg-gradient-to-b from-teal-50 to-[#f8fafb] py-12 sm:py-16 text-center px-4">
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <QrCode className="w-3.5 h-3.5" />
          Outil gratuit
        </div>
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight"
          style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
        >
          Generateur de QR Code Menu Restaurant — Gratuit
        </h1>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto text-base sm:text-lg">
          Creez un QR code pour votre menu en quelques secondes. Vos clients scannent, decouvrent votre carte.
        </p>
      </header>

      {/* ── Main ── */}
      <main className="max-w-3xl mx-auto px-4 pb-20 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
          {/* URL input */}
          <div>
            <label htmlFor="menu-url" className="block text-sm font-semibold text-slate-700 mb-1.5">
              URL de votre menu ou site restaurant
            </label>
            <input
              id="menu-url"
              type="url"
              placeholder="https://mon-restaurant.com/menu"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Size */}
            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Taille du QR code</span>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg border transition ${
                      size === s.value
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-teal-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-2">Couleur</span>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg border transition ${
                      color === c.value
                        ? 'ring-2 ring-teal-500 border-teal-500'
                        : 'border-slate-300 hover:border-teal-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full inline-block border border-slate-200" style={{ backgroundColor: c.bg }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QR Preview */}
          <div className="flex flex-col items-center gap-4 pt-2">
            {qrUrl ? (
              <img
                ref={imgRef}
                src={qrUrl}
                alt={`QR code pour ${url}`}
                width={size}
                height={size}
                className="rounded-lg border border-slate-200 shadow-sm"
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400"
                style={{ width: size, height: size }}
              >
                <QrCode className="w-12 h-12 mb-2 opacity-40" />
                <span className="text-xs">Entrez une URL</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              disabled={!qrUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition"
            >
              <Download className="w-4 h-4" />
              Telecharger PNG
            </button>

            <button
              onClick={handleCopy}
              disabled={!url.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-xl transition"
            >
              {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copie !' : 'Copier le lien'}
            </button>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-12 text-center bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-8 sm:p-10 text-white">
          <h2
            className="text-xl sm:text-2xl font-bold mb-2"
            style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}
          >
            Creez votre menu digital complet avec RestauMargin
          </h2>
          <p className="text-teal-100 text-sm sm:text-base mb-5 max-w-md mx-auto">
            Gerez vos recettes, calculez vos marges et publiez un menu QR professionnel — tout-en-un.
          </p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-teal-50 transition"
          >
            Essayer gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── SEO text ── */}
        <section className="mt-12 space-y-6 text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
            Pourquoi utiliser un QR code pour votre menu ?
          </h2>
          <p>
            Un QR code sur chaque table permet a vos clients de consulter votre carte sans contact, directement sur leur smartphone.
            Plus besoin de reimprimer vos menus a chaque changement de prix ou de plat : modifiez votre page en ligne et le QR code reste le meme.
          </p>
          <h3 className="text-base font-bold text-slate-800">Comment utiliser ce generateur ?</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Collez l'URL de votre menu en ligne (ou de votre site restaurant).</li>
            <li>Choisissez la taille et la couleur du QR code.</li>
            <li>Telechargez l'image PNG et imprimez-la sur vos supports (table, vitrine, flyer).</li>
          </ol>
          <p>
            Cet outil est 100 % gratuit et ne necessite aucune inscription. Pour aller plus loin, decouvrez
            {' '}
            <Link to="/" className="text-teal-600 underline hover:text-teal-700">RestauMargin</Link>
            {' '}
            et gerez tout votre restaurant depuis une seule plateforme.
          </p>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} RestauMargin &mdash; Tous droits reserves.
      </footer>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Star, ChefHat, ArrowRight } from 'lucide-react';

const PLACEHOLDER_TESTIMONIALS = [
  {
    quote: "Bientot les temoignages de nos premiers clients...",
    name: "Votre nom ici",
    restaurant: "Votre restaurant",
    city: "Paris",
    rating: 5,
  },
  {
    quote: "Bientot les temoignages de nos premiers clients...",
    name: "Votre nom ici",
    restaurant: "Votre restaurant",
    city: "Lyon",
    rating: 5,
  },
  {
    quote: "Bientot les temoignages de nos premiers clients...",
    name: "Votre nom ici",
    restaurant: "Votre restaurant",
    city: "Marseille",
    rating: 5,
  },
];

export default function Temoignages() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#111111]">RestauMargin</span>
          </Link>
          <Link
            to="/login?mode=register"
            className="px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#333333] transition-colors"
          >
            Essai gratuit
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">
            Temoignages
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight">
            Ce que disent nos clients
          </h1>
          <p className="text-lg text-[#6B7280] mt-4 max-w-lg mx-auto">
            Decouvrez comment RestauMargin aide les restaurateurs a maitriser leurs marges au quotidien.
          </p>
        </div>
      </section>

      {/* Testimonial Cards */}
      <section className="pb-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#111111] transition-colors group"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-[#111111] text-[#111111]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#6B7280] text-sm leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>

                {/* Divider */}
                <div className="border-t border-[#E5E7EB] pt-4">
                  <p className="text-sm font-semibold text-[#111111]">{t.name}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {t.restaurant} — {t.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 rounded-2xl border-2 border-[#111111] bg-[#111111]">
            <h2 className="text-2xl font-bold text-white mb-2">
              Devenez l'un de nos premiers utilisateurs
            </h2>
            <p className="text-[#A3A3A3] text-sm mb-6">
              Rejoignez RestauMargin gratuitement et optimisez vos marges des aujourd'hui.
            </p>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#111111] text-sm font-semibold hover:bg-[#E5E7EB] transition-colors"
            >
              Commencer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9CA3AF]">RestauMargin &copy; 2026. Tous droits reserves.</p>
          <div className="flex items-center gap-6 text-xs text-[#9CA3AF]">
            <Link to="/mentions-legales" className="hover:text-[#111111] transition-colors">Mentions legales</Link>
            <Link to="/cgu" className="hover:text-[#111111] transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-[#111111] transition-colors">Confidentialite</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

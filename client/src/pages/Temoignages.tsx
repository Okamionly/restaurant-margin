import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, ChefHat, ArrowRight, Quote, Play, Users, TrendingUp,
  ThumbsUp, Filter, Eye
} from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  restaurant: string;
  city: string;
  rating: number;
  cuisine: string;
  featured?: boolean;
  hasVideo?: boolean;
  savings?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Avant RestauMargin, je calculais mes marges sur Excel et je perdais un temps fou. Maintenant, chaque fiche technique est a jour en temps reel. J'ai reduit mon food cost de 7 points en 3 mois.",
    name: "Thomas Renard",
    role: "Chef proprietaire",
    restaurant: "Le Comptoir de Tom",
    city: "Paris 11e",
    rating: 5,
    cuisine: "Bistronomique",
    featured: true,
    savings: "-7pts food cost",
  },
  {
    quote: "Le scanner de factures IA m'a change la vie. Je photographie la facture et les prix se mettent a jour automatiquement dans toutes mes fiches. C'est magique.",
    name: "Sophie Marchand",
    role: "Gerante",
    restaurant: "Chez Sophie",
    city: "Lyon 2e",
    rating: 5,
    cuisine: "Francaise",
    hasVideo: true,
    savings: "2h/semaine gagnees",
  },
  {
    quote: "Avec 3 restaurants a gerer, le plan Business est indispensable. Je vois les marges de chaque etablissement en un clin d'oeil. Le rapport IA hebdomadaire me donne des insights que je n'aurais jamais trouves seul.",
    name: "Karim Benali",
    role: "Directeur multi-sites",
    restaurant: "Groupe K&B",
    city: "Marseille",
    rating: 5,
    cuisine: "Mediterraneenne",
    savings: "+12% de marge",
  },
  {
    quote: "La commande fournisseur en 1 clic par WhatsApp, c'est exactement ce qu'il me fallait. Fini les appels a 6h du matin pour passer mes commandes.",
    name: "Marie Dubois",
    role: "Chef",
    restaurant: "La Table de Marie",
    city: "Bordeaux",
    rating: 5,
    cuisine: "Gastronomique",
  },
  {
    quote: "L'IA m'a suggere de remplacer un ingredient qui faisait exploser mon food cost. Resultat : meme gout, 4 euros de moins par plat. Sur 80 couverts/jour, ca fait une enorme difference.",
    name: "Lucas Petit",
    role: "Chef executif",
    restaurant: "Brasserie Lucas",
    city: "Toulouse",
    rating: 5,
    cuisine: "Brasserie",
    hasVideo: true,
    savings: "4EUR/plat economises",
  },
  {
    quote: "Le module HACCP digital m'a permis de passer mon controle sanitaire sans stress. Tout est trace, tout est propre. L'inspecteur etait impressionne.",
    name: "Amelie Rousseau",
    role: "Proprietaire",
    restaurant: "Le Potager d'Amelie",
    city: "Nantes",
    rating: 4,
    cuisine: "Vegetarienne",
  },
  {
    quote: "J'utilise la commande vocale pour creer mes recettes pendant que je cuisine. Je dicte les ingredients et les quantites, et la fiche technique se cree toute seule.",
    name: "Pierre Martin",
    role: "Chef patissier",
    restaurant: "Patisserie Martin",
    city: "Strasbourg",
    rating: 5,
    cuisine: "Patisserie",
    savings: "30 min/recette",
  },
  {
    quote: "La Mercuriale m'a permis de detecter que mon fournisseur de saumon avait augmente ses prix de 15% en douce. Grace a l'alerte, j'ai pu negocier immediatement.",
    name: "Nadia Khelil",
    role: "Directrice",
    restaurant: "Sushi Nadia",
    city: "Nice",
    rating: 5,
    cuisine: "Japonaise",
    hasVideo: true,
  },
  {
    quote: "Pour un pizzaiolo comme moi, savoir exactement combien coute chaque pizza est essentiel. RestauMargin me donne ce chiffre en temps reel, et je peux ajuster mes prix en consequence.",
    name: "Marco Rossi",
    role: "Pizzaiolo",
    restaurant: "Da Marco",
    city: "Montpellier",
    rating: 5,
    cuisine: "Italienne",
    savings: "+8% de marge",
  },
  {
    quote: "L'essai gratuit m'a convaincu en 2 jours. L'interface est claire, simple, et pensee pour nous les restaurateurs. Pas besoin d'etre un geek pour l'utiliser.",
    name: "Claire Fontaine",
    role: "Co-gerante",
    restaurant: "Bistrot Fontaine",
    city: "Rennes",
    rating: 4,
    cuisine: "Bistronomique",
  },
  {
    quote: "Le Menu Engineering m'a montre que 3 de mes plats les plus vendus avaient les pires marges. J'ai ajuste les portions et les prix : +5 000 EUR de benefice ce trimestre.",
    name: "David Chen",
    role: "Restaurateur",
    restaurant: "Le Dragon d'Or",
    city: "Paris 13e",
    rating: 5,
    cuisine: "Asiatique",
    savings: "+5 000EUR/trimestre",
  },
  {
    quote: "Nous avons teste plusieurs logiciels avant de trouver RestauMargin. C'est le seul qui comprend vraiment les besoins d'un restaurant. Le support est reactif et les mises a jour regulieres.",
    name: "Isabelle Laurent",
    role: "Directrice operations",
    restaurant: "Groupe Laurent",
    city: "Lille",
    rating: 5,
    cuisine: "Francaise",
  },
];

const CUISINE_FILTERS = [
  "Tous",
  "Francaise",
  "Bistronomique",
  "Mediterraneenne",
  "Italienne",
  "Asiatique",
  "Japonaise",
  "Gastronomique",
  "Vegetarienne",
  "Brasserie",
  "Patisserie",
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-black text-black'
              : 'fill-mono-900 text-mono-900'
          }`}
        />
      ))}
    </div>
  );
}

export default function Temoignages() {
  const [activeCuisine, setActiveCuisine] = useState("Tous");

  const featured = TESTIMONIALS.find(t => t.featured);
  const filteredTestimonials = TESTIMONIALS.filter(t => {
    if (activeCuisine === "Tous") return !t.featured;
    return !t.featured && t.cuisine === activeCuisine;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-mono-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-black">RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/tarifs"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-black transition-colors"
            >
              Tarifs
            </Link>
            <Link
              to="/login?mode=register"
              className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-[#333333] transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Featured Testimonial */}
      {featured && (
        <section className="pt-20 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">
              Temoignages
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black leading-tight mb-12">
              Ils ont repris le controle de leurs marges
            </h1>

            {/* Featured card */}
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-8 sm:p-12 text-left relative">
              <Quote className="w-10 h-10 text-black/10 absolute top-6 left-6" />
              <div className="relative">
                <StarRating rating={featured.rating} />
                <p className="text-lg sm:text-xl text-[#374151] leading-relaxed mt-4 mb-8 italic">
                  "{featured.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                    {featured.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{featured.name}</p>
                    <p className="text-sm text-[#6B7280]">
                      {featured.role} — {featured.restaurant}, {featured.city}
                    </p>
                  </div>
                  {featured.savings && (
                    <div className="ml-auto hidden sm:flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      {featured.savings}
                    </div>
                  )}
                </div>
                {featured.savings && (
                  <div className="mt-4 sm:hidden inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {featured.savings}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section className="border-y border-mono-900 bg-black py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <ThumbsUp className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-3xl font-extrabold text-white">93%</p>
            <p className="text-sm text-white/50 mt-1">Taux de satisfaction</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-3xl font-extrabold text-white">4.8/5</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-white text-white' : 'fill-white/40 text-white/40'}`} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-3xl font-extrabold text-white">150+</p>
            <p className="text-sm text-white/50 mt-1">Restaurants actifs</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-3xl font-extrabold text-white">-5pts</p>
            <p className="text-sm text-white/50 mt-1">Food cost moyen</p>
          </div>
        </div>
      </section>

      {/* Cuisine Filter */}
      <section className="pt-16 pb-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-[#9CA3AF]" />
            <span className="text-sm font-medium text-[#9CA3AF]">Filtrer par cuisine</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CUISINE_FILTERS.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setActiveCuisine(cuisine)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeCuisine === cuisine
                    ? 'bg-black text-white'
                    : 'bg-mono-950 text-[#6B7280] hover:bg-mono-900 hover:text-black'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Cards Masonry Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#9CA3AF] text-lg">Aucun temoignage pour cette cuisine.</p>
              <button
                onClick={() => setActiveCuisine("Tous")}
                className="mt-4 text-sm font-medium text-black underline"
              >
                Voir tous les temoignages
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredTestimonials.map((t, i) => (
                <div
                  key={i}
                  className="break-inside-avoid p-6 rounded-2xl border border-mono-900 bg-white hover:border-black/30 transition-all duration-200 group"
                >
                  {/* Video placeholder */}
                  {t.hasVideo && (
                    <div className="mb-4 rounded-xl bg-mono-950 aspect-video flex items-center justify-center group-hover:bg-mono-900 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Stars */}
                  <StarRating rating={t.rating} />

                  {/* Savings badge */}
                  {t.savings && (
                    <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-mono-950 rounded-lg text-xs font-semibold text-black">
                      <TrendingUp className="w-3 h-3" />
                      {t.savings}
                    </div>
                  )}

                  {/* Quote */}
                  <p className="text-[#374151] text-sm leading-relaxed mt-4 mb-6">
                    "{t.quote}"
                  </p>

                  {/* Divider + Author */}
                  <div className="border-t border-mono-900 pt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-black truncate">{t.name}</p>
                      <p className="text-xs text-[#9CA3AF] truncate">
                        {t.restaurant} — {t.city}
                      </p>
                    </div>
                  </div>

                  {/* Cuisine tag */}
                  <div className="mt-3">
                    <span className="text-xs text-[#9CA3AF] bg-[#F9FAFB] px-2 py-1 rounded-md">
                      {t.cuisine}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-2xl bg-black">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Rejoignez-les
            </h2>
            <p className="text-white/50 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Plus de 150 restaurants optimisent deja leurs marges avec RestauMargin. A votre tour.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://buy.stripe.com/9B614g1u2eRe9QU6vl87K04"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-mono-950 text-black font-semibold rounded-xl transition-colors"
              >
                Commencer l'essai gratuit
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-colors"
              >
                <Eye className="w-5 h-5" />
                Voir la demo
              </Link>
            </div>
            <p className="text-xs text-white/30 mt-6">
              7 jours d'essai gratuit. Sans carte bancaire.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mono-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9CA3AF]">RestauMargin &copy; 2026. Tous droits reserves.</p>
          <div className="flex items-center gap-6 text-xs text-[#9CA3AF]">
            <Link to="/mentions-legales" className="hover:text-black transition-colors">Mentions legales</Link>
            <Link to="/cgu" className="hover:text-black transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-black transition-colors">Confidentialite</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, ChefHat, Eye, Briefcase, PieChart as PieChartIcon } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';

const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#e11d48', '#4f46e5'];

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string; value: string; subtitle?: string; icon: any; color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</div>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => console.error('Erreur'))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalRecipes = recipes.length;
    if (totalRecipes === 0) return null;

    const avgMargin = recipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalRecipes;
    const avgCoefficient = recipes.reduce((s, r) => s + r.margin.coefficient, 0) / totalRecipes;
    const bestMargin = Math.max(...recipes.map((r) => r.margin.marginPercent));
    const worstMargin = Math.min(...recipes.map((r) => r.margin.marginPercent));
    const avgFoodCost = recipes.reduce((s, r) => s + r.margin.costPerPortion, 0) / totalRecipes;
    const avgLaborCost = recipes.reduce((s, r) => s + (r.margin.laborCostPerPortion || 0), 0) / totalRecipes;
    const avgTotalCost = recipes.reduce((s, r) => s + (r.margin.totalCostPerPortion || r.margin.costPerPortion), 0) / totalRecipes;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; totalMargin: number; totalRevenue: number; totalCost: number }>();
    recipes.forEach((r) => {
      const existing = categoryMap.get(r.category) || { count: 0, totalMargin: 0, totalRevenue: 0, totalCost: 0 };
      categoryMap.set(r.category, {
        count: existing.count + 1,
        totalMargin: existing.totalMargin + r.margin.marginPercent,
        totalRevenue: existing.totalRevenue + r.sellingPrice,
        totalCost: existing.totalCost + (r.margin.totalCostPerPortion || r.margin.costPerPortion),
      });
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      avgMargin: Math.round((data.totalMargin / data.count) * 10) / 10,
      revenue: Math.round(data.totalRevenue * 100) / 100,
    }));

    // Margin distribution
    const marginBuckets = [
      { name: '< 50%', count: 0, color: '#dc2626' },
      { name: '50-60%', count: 0, color: '#ea580c' },
      { name: '60-70%', count: 0, color: '#d97706' },
      { name: '70-80%', count: 0, color: '#65a30d' },
      { name: '> 80%', count: 0, color: '#059669' },
    ];
    recipes.forEach((r) => {
      const m = r.margin.marginPercent;
      if (m < 50) marginBuckets[0].count++;
      else if (m < 60) marginBuckets[1].count++;
      else if (m < 70) marginBuckets[2].count++;
      else if (m < 80) marginBuckets[3].count++;
      else marginBuckets[4].count++;
    });

    // Top 10 recipes by margin
    const topRecipes = [...recipes]
      .sort((a, b) => b.margin.marginPercent - a.margin.marginPercent)
      .slice(0, 10)
      .map((r) => ({
        name: r.name.length > 20 ? r.name.substring(0, 20) + '...' : r.name,
        fullName: r.name,
        margin: r.margin.marginPercent,
        cost: r.margin.totalCostPerPortion || r.margin.costPerPortion,
        price: r.sellingPrice,
      }));

    return {
      totalRecipes, avgMargin, avgCoefficient, bestMargin, worstMargin,
      avgFoodCost, avgLaborCost, avgTotalCost,
      categoryData, marginBuckets, topRecipes,
    };
  }, [recipes]);

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  if (!stats || stats.totalRecipes === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Tableau de bord</h2>
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
          <ChefHat className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Bienvenue sur RestauMargin</h3>
          <p className="text-slate-400 dark:text-slate-500 mb-6">Commencez par ajouter des ingrédients puis créez vos fiches techniques.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/ingredients" className="btn-primary">Ajouter des ingrédients</Link>
            <Link to="/recipes" className="btn-secondary">Créer une recette</Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedByMargin = [...recipes].sort((a, b) => a.margin.marginPercent - b.margin.marginPercent);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3 border dark:border-slate-700 text-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-100">{payload[0].payload.fullName || payload[0].payload.name}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="mt-1">
              {p.name}: {typeof p.value === 'number' ? (p.name.includes('%') || p.name === 'Marge' ? `${p.value.toFixed(1)}%` : `${p.value.toFixed(2)} \u20ac`) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Tableau de bord</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Recettes" value={String(stats.totalRecipes)} icon={ChefHat} color="bg-blue-600" />
        <StatCard
          title="Marge moyenne"
          value={`${stats.avgMargin.toFixed(1)}%`}
          subtitle={stats.avgMargin >= 70 ? 'Objectif atteint' : 'Objectif : > 70%'}
          icon={TrendingUp}
          color={stats.avgMargin >= 70 ? 'bg-green-600' : 'bg-amber-500'}
        />
        <StatCard title="Coefficient moyen" value={stats.avgCoefficient.toFixed(2)} subtitle="Objectif : > 3.3" icon={DollarSign} color="bg-purple-600" />
        <StatCard
          title="Coût moyen total"
          value={`${stats.avgTotalCost.toFixed(2)} \u20ac`}
          subtitle={stats.avgLaborCost > 0 ? `Matière ${stats.avgFoodCost.toFixed(2)}\u20ac + MO ${stats.avgLaborCost.toFixed(2)}\u20ac` : 'Matière seule'}
          icon={Briefcase}
          color="bg-cyan-600"
        />
        <StatCard title="Marge min / max" value={`${stats.worstMargin.toFixed(0)}% / ${stats.bestMargin.toFixed(0)}%`} icon={TrendingDown} color="bg-slate-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Category Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Répartition par catégorie
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="count"
                nameKey="name"
                label={({ name, count }: { name: string; count: number }) => `${name} (${count})`}
              >
                {stats.categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Margin Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Distribution des marges
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.marginBuckets}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Nb recettes" radius={[4, 4, 0, 0]}>
                {stats.marginBuckets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Recipes Chart */}
      {stats.topRecipes.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 mb-8">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">
            Top {stats.topRecipes.length} recettes par marge
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topRecipes} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="margin" name="Marge" fill="#059669" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.categoryData.map((cat, i) => (
          <div key={cat.name} className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{cat.count} plat{cat.count > 1 ? 's' : ''}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Marge moy. : <span className={cat.avgMargin >= 70 ? 'text-green-600 font-semibold' : cat.avgMargin >= 60 ? 'text-amber-600 font-semibold' : 'text-red-600 font-semibold'}>{cat.avgMargin}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recipes Table sorted by margin */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="px-5 py-4 border-b dark:border-slate-700">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Détail par plat</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Plat</th>
                <th className="px-5 py-3 text-left font-medium">Catégorie</th>
                <th className="px-5 py-3 text-right font-medium">Prix vente</th>
                <th className="px-5 py-3 text-right font-medium">Coût matière</th>
                <th className="px-5 py-3 text-right font-medium">Coût MO</th>
                <th className="px-5 py-3 text-right font-medium">Coût total</th>
                <th className="px-5 py-3 text-right font-medium">Marge &euro;</th>
                <th className="px-5 py-3 text-right font-medium">Marge %</th>
                <th className="px-5 py-3 text-right font-medium">Coeff.</th>
                <th className="px-5 py-3 text-center font-medium">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sortedByMargin.map((r) => {
                const mc = r.margin.marginPercent >= 70 ? 'text-green-600' : r.margin.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';
                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">{r.name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{r.category}</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.sellingPrice.toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.costPerPortion.toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{(r.margin.laborCostPerPortion || 0).toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.marginAmount.toFixed(2)} &euro;</td>
                    <td className={`px-5 py-3 text-right font-mono font-semibold ${mc}`}>{r.margin.marginPercent.toFixed(1)}%</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.coefficient.toFixed(2)}</td>
                    <td className="px-5 py-3 text-center">
                      <Link to={`/recipes/${r.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4 inline" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

// ---------- Mock data ----------

const STATS = [
  { label: 'Recettes', value: '38', icon: 'restaurant-outline', color: colors.primary },
  { label: 'Marge moy.', value: '66.9%', icon: 'trending-up-outline', color: colors.success },
  { label: 'Cout moyen', value: '5.05€', icon: 'cash-outline', color: colors.warning },
  { label: 'Min / Max', value: '42% / 83%', icon: 'analytics-outline', color: colors.primaryLight },
];

const ALERTS = [
  { name: 'Risotto truffe', margin: '42%', severity: 'danger' as const },
  { name: 'Tartare saumon', margin: '48%', severity: 'warning' as const },
  { name: 'Souffle chocolat', margin: '51%', severity: 'warning' as const },
];

// ---------- Components ----------

function StatCard({
  label,
  value,
  icon,
  color,
  dark,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  dark: boolean;
}) {
  return (
    <View style={[styles.statCard, dark && styles.statCardDark]}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.statValue, dark && styles.textLight]}>{value}</Text>
      <Text style={[styles.statLabel, dark && styles.textMuted]}>{label}</Text>
    </View>
  );
}

function AlertRow({
  name,
  margin,
  severity,
  dark,
}: {
  name: string;
  margin: string;
  severity: 'danger' | 'warning';
  dark: boolean;
}) {
  const badgeColor = severity === 'danger' ? colors.danger : colors.warning;
  const badgeBg = severity === 'danger' ? colors.dangerBg : colors.warningBg;

  return (
    <View style={[styles.alertRow, dark && styles.alertRowDark]}>
      <Ionicons
        name="alert-circle"
        size={20}
        color={badgeColor}
        style={{ marginRight: spacing.md }}
      />
      <Text style={[styles.alertName, dark && styles.textLight]} numberOfLines={1}>
        {name}
      </Text>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <Text style={[styles.badgeText, { color: badgeColor }]}>{margin}</Text>
      </View>
    </View>
  );
}

// ---------- Screen ----------

export default function DashboardScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, dark && styles.safeDark]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, dark && styles.textLight]}>RestauMargin</Text>
          <Text style={[styles.headerSub, dark && styles.textMuted]}>
            Le Bistrot Parisien
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color={dark ? colors.gray300 : colors.gray600} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Stats grid */}
        <Text style={[styles.sectionTitle, dark && styles.textLight]}>
          Vue d'ensemble
        </Text>
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} dark={dark} />
          ))}
        </View>

        {/* Alerts */}
        <Text style={[styles.sectionTitle, dark && styles.textLight]}>
          Alertes marge faible
        </Text>
        <View style={[styles.alertCard, dark && styles.alertCardDark]}>
          {ALERTS.map((a, i) => (
            <React.Fragment key={a.name}>
              <AlertRow {...a} dark={dark} />
              {i < ALERTS.length - 1 && (
                <View style={[styles.divider, dark && styles.dividerDark]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  safeDark: { backgroundColor: colors.gray900 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.h2,
    fontWeight: '800',
    color: colors.primary,
  },
  headerSub: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    padding: spacing.sm,
  },

  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statCardDark: { backgroundColor: colors.gray800 },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.h2,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  alertCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  alertCardDark: { backgroundColor: colors.gray800 },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  alertRowDark: {},
  alertName: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  dividerDark: { backgroundColor: colors.gray700 },

  textLight: { color: colors.gray100 },
  textMuted: { color: colors.gray400 },
});

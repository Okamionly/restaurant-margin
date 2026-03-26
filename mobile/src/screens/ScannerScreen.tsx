import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

// ---------- Mock data ----------

const RECENT_SCANS = [
  { id: '1', supplier: 'Metro Cash & Carry', date: '25/03/2026', items: 14, total: '487.30\u20AC' },
  { id: '2', supplier: 'Rungis Frais', date: '22/03/2026', items: 8, total: '312.50\u20AC' },
  { id: '3', supplier: 'Brake France', date: '18/03/2026', items: 21, total: '1 024.80\u20AC' },
];

// ---------- Screen ----------

export default function ScannerScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  return (
    <SafeAreaView style={[styles.safe, dark && styles.safeDark]} edges={['top']}>
      {/* Header */}
      <Text style={[styles.title, dark && styles.textLight]}>Scanner de factures</Text>
      <Text style={[styles.subtitle, dark && styles.textMuted]}>
        Photographiez ou importez vos factures fournisseur
      </Text>

      {/* Camera placeholder */}
      <View style={[styles.cameraBox, dark && styles.cameraBoxDark]}>
        <Ionicons name="camera-outline" size={56} color={colors.gray400} />
        <Text style={[styles.cameraLabel, dark && styles.textMuted]}>
          Apercu camera
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
          <Ionicons name="camera" size={20} color={colors.white} />
          <Text style={styles.btnPrimaryText}>Prendre une photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnSecondary, dark && styles.btnSecondaryDark]}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={20} color={colors.primary} />
          <Text style={[styles.btnSecondaryText]}>Importer depuis la galerie</Text>
        </TouchableOpacity>
      </View>

      {/* Recent scans */}
      <Text style={[styles.sectionTitle, dark && styles.textLight]}>
        Scans recents
      </Text>

      <FlatList
        data={RECENT_SCANS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[styles.scanRow, dark && styles.scanRowDark]}>
            <View style={styles.scanIcon}>
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.scanInfo}>
              <Text style={[styles.scanSupplier, dark && styles.textLight]} numberOfLines={1}>
                {item.supplier}
              </Text>
              <Text style={[styles.scanMeta, dark && styles.textMuted]}>
                {item.date} &middot; {item.items} articles
              </Text>
            </View>
            <Text style={[styles.scanTotal, dark && styles.textLight]}>{item.total}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={[styles.divider, dark && styles.dividerDark]} />
        )}
      />
    </SafeAreaView>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  safeDark: { backgroundColor: colors.gray900 },

  title: {
    fontSize: typography.h2,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  cameraBox: {
    height: 200,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cameraBoxDark: { backgroundColor: colors.gray800, borderColor: colors.gray700 },
  cameraLabel: { fontSize: typography.bodySmall, color: colors.gray400 },

  actions: { gap: spacing.md, marginTop: spacing.lg },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.md,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnSecondaryDark: { backgroundColor: colors.gray800, borderColor: colors.primaryLight },
  btnSecondaryText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },

  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  scanRowDark: {},
  scanIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  scanInfo: { flex: 1 },
  scanSupplier: { fontSize: typography.body, fontWeight: '600', color: colors.text },
  scanMeta: { fontSize: typography.caption, color: colors.textSecondary, marginTop: 2 },
  scanTotal: { fontSize: typography.body, fontWeight: '700', color: colors.text },

  divider: { height: 1, backgroundColor: colors.border },
  dividerDark: { backgroundColor: colors.gray700 },

  textLight: { color: colors.gray100 },
  textMuted: { color: colors.gray400 },
});

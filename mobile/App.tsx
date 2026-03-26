import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DashboardScreen from './src/screens/DashboardScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import { colors, typography, spacing } from './src/theme';

// ---------- Placeholder screens ----------

function PlaceholderScreen({ name, icon }: { name: string; icon: string }) {
  return (
    <View style={styles.placeholder}>
      <Ionicons name={icon as any} size={64} color={colors.primary} />
      <Text style={styles.placeholderTitle}>{name}</Text>
      <Text style={styles.placeholderSub}>Bientot disponible</Text>
    </View>
  );
}

function RecettesScreen() {
  return <PlaceholderScreen name="Recettes" icon="restaurant-outline" />;
}

function InventaireScreen() {
  return <PlaceholderScreen name="Inventaire" icon="cube-outline" />;
}

function ProfilScreen() {
  return <PlaceholderScreen name="Profil" icon="person-outline" />;
}

// ---------- Tab Navigator ----------

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: string; default: string }> = {
  Dashboard: { focused: 'home', default: 'home-outline' },
  Recettes: { focused: 'restaurant', default: 'restaurant-outline' },
  Inventaire: { focused: 'cube', default: 'cube-outline' },
  Scanner: { focused: 'camera', default: 'camera-outline' },
  Profil: { focused: 'person', default: 'person-outline' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray400,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ focused, color, size }) => {
              const icons = TAB_ICONS[route.name];
              const iconName = focused ? icons.focused : icons.default;
              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ tabBarLabel: 'Accueil' }}
          />
          <Tab.Screen
            name="Recettes"
            component={RecettesScreen}
            options={{ tabBarLabel: 'Recettes' }}
          />
          <Tab.Screen
            name="Inventaire"
            component={InventaireScreen}
            options={{ tabBarLabel: 'Inventaire' }}
          />
          <Tab.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ tabBarLabel: 'Scanner' }}
          />
          <Tab.Screen
            name="Profil"
            component={ProfilScreen}
            options={{ tabBarLabel: 'Profil' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 88,
    paddingBottom: 28,
    paddingTop: spacing.sm,
  },
  tabLabel: {
    fontSize: typography.label,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  placeholderTitle: {
    fontSize: typography.h2,
    fontWeight: '700',
    color: colors.text,
  },
  placeholderSub: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
});

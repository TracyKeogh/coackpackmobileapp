import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, User, FileText, Shield, HelpCircle, Info } from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface MenuItem {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: User,
      title: 'Account',
      subtitle: user?.email || 'Not signed in',
      onPress: () => {
        if (!user) {
          Alert.alert('Sign In Required', 'Please sign in to view account details.');
        } else {
          Alert.alert('Account', `Signed in as: ${user.email}`);
        }
      },
    },
    {
      icon: FileText,
      title: 'Terms of Service',
      subtitle: 'View our terms',
      onPress: () => Alert.alert('Terms of Service', 'Terms of service content here'),
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      onPress: () => Alert.alert('Privacy Policy', 'Privacy policy content here'),
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help with the app',
      onPress: () => Alert.alert('Help & Support', 'Contact support@dailyfocus.app'),
    },
    {
      icon: Info,
      title: 'About',
      subtitle: 'Version 1.0.0',
      onPress: () => Alert.alert('About', 'Daily Focus v1.0.0\n\nYour daily planning companion'),
    },
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Icon size={20} color="#6b7280" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {user && (
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#ffffff" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    padding: 16,
    gap: 8,
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
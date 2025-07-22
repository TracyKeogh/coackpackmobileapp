import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, User, FileText, Shield, CircleHelp as HelpCircle, Info } from 'lucide-react-native';
import { supabase } from '../../supabase/client';

export default function SettingsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<any>(null);
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
              router.replace('/(auth)/signin');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: User,
      title: 'Account',
      subtitle: user?.email || 'Not signed in',
      onPress: () => {
        if (!user) {
          router.push('/(auth)/signin');
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
      onPress: () => Alert.alert('Help & Support', 'Contact support@coachpack.app'),
    },
    {
      icon: Info,
      title: 'About',
      subtitle: 'Version 1.0.0',
      onPress: () => Alert.alert('About', 'Coach Pack Mobile v1.0.0\n\nYour daily planning companion'),
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Icon size={24} color="#666" />
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
            <LogOut size={20} color="white" />
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    gap: 2,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 16,
    gap: 8,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
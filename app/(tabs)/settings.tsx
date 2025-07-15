import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Trash2, Download, Upload, Info } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';
import { useRouter } from 'expo-router';

export default function SettingsTab() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const clearAllEntries = () => {
    Alert.alert(
      'Clear All Entries',
      'Are you sure you want to delete all diary entries? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', style: 'destructive', onPress: performClearAll }
      ]
    );
  };

  const performClearAll = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('diaryEntries');
      Alert.alert('Success', 'All diary entries have been cleared.');
    } catch (error) {
      console.error('Error clearing entries:', error);
      Alert.alert('Error', 'Failed to clear entries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportEntries = async () => {
    setIsLoading(true);
    try {
      const entries = await AsyncStorage.getItem('diaryEntries');
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        const exportData = JSON.stringify(parsedEntries, null, 2);
        // In a real app, you would save this to a file or share it
        Alert.alert('Export Data', 'Diary entries exported successfully!');
        console.log('Exported data:', exportData);
      } else {
        Alert.alert('No Data', 'No diary entries found to export.');
      }
    } catch (error) {
      console.error('Error exporting entries:', error);
      Alert.alert('Error', 'Failed to export entries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAbout = () => {
    Alert.alert(
      'About Daily Diary',
      'A simple, clean diary app for capturing your daily thoughts and experiences.\n\nVersion 1.0.0\nBuilt with React Native & Expo'
    );
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      Alert.alert('Sign Out Error', error.message);
    } else {
      router.replace('/(auth)/signin');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <TouchableOpacity style={styles.settingItem} onPress={exportEntries}>
            <Download size={20} color="#2563eb" />
            <Text style={styles.settingText}>Export Entries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={clearAllEntries}>
            <Trash2 size={20} color="#dc2626" />
            <Text style={[styles.settingText, styles.dangerText]}>Clear All Entries</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem} onPress={showAbout}>
            <Info size={20} color="#2563eb" />
            <Text style={styles.settingText}>About Daily Diary</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Upload size={20} color="#8b5cf6" />
            <Text style={styles.settingText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  settingText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  dangerText: {
    color: '#dc2626',
  },
});
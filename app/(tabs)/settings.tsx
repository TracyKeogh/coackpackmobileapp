import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Trash2, Download, Upload, Info } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsTab() {
  const [isLoading, setIsLoading] = useState(false);

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

        <View style={styles.connectSection}>
          <Text style={styles.connectTitle}>Connect to Supabase</Text>
          <Text style={styles.connectDescription}>
            To sync your diary entries across devices, connect to Supabase for cloud storage and backup.
          </Text>
          <TouchableOpacity style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect to Supabase</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  dangerText: {
    color: '#dc2626',
  },
  connectSection: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  connectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
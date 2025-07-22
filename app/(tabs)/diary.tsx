import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Save, Calendar, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveDiaryEntry, loadDiaryEntry, getCurrentUser } from '../../supabase/client';

export default function DiaryTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntry, setDiaryEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (params.date) {
      setSelectedDate(new Date(params.date as string));
    }
  }, [params.date]);

  useEffect(() => {
    checkAuthAndLoadEntry();
  }, [selectedDate]);

  useEffect(() => {
    const words = diaryEntry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [diaryEntry]);

  const checkAuthAndLoadEntry = async () => {
    try {
      const { user } = await getCurrentUser();
      
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      await loadDiaryEntryFromSupabase();
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    }
  };

  const loadDiaryEntryFromSupabase = async () => {
    setIsLoading(true);
    try {
      const dateKey = formatDate(selectedDate);
      const { data, error } = await loadDiaryEntry(dateKey);
      
      if (error) {
        console.error('Error loading diary entry:', error);
        setDiaryEntry('');
      } else {
        setDiaryEntry(data || '');
      }
    } catch (error) {
      console.error('Exception loading diary entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDiaryEntryToSupabase = async () => {
    if (!isAuthenticated) {
      Alert.alert('Error', 'Please sign in to save your diary entry.');
      return;
    }

    setIsSaving(true);
    try {
      const dateKey = formatDate(selectedDate);
      const { error } = await saveDiaryEntry(dateKey, diaryEntry);
      
      if (error) {
        console.error('Error saving diary entry:', error);
        Alert.alert('Error', 'Failed to save diary entry. Please try again.');
      } else {
        Alert.alert('Success', 'Diary entry saved successfully!');
      }
    } catch (error) {
      console.error('Exception saving diary entry:', error);
      Alert.alert('Error', 'Failed to save diary entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.dateNavigation}>
            <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
              <ArrowLeft size={24} color="#2563eb" />
            </TouchableOpacity>
            <View style={styles.dateInfo}>
              <Text style={styles.title}>Daily Diary</Text>
              <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
              {isToday(selectedDate) && <Text style={styles.todayBadge}>Today</Text>}
            </View>
            <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
              <Text style={styles.nextArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryLabel}>How was your day?</Text>
            <Text style={styles.wordCount}>{wordCount} words</Text>
          </View>

          <TextInput
            style={styles.textInput}
            value={diaryEntry}
            onChangeText={setDiaryEntry}
            placeholder="Write about your thoughts and experiences..."
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.saveButton, (isSaving || !isAuthenticated) && styles.disabledButton]}
            onPress={saveDiaryEntryToSupabase}
            disabled={isSaving || !isAuthenticated}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Entry'}
            </Text>
          </TouchableOpacity>

          {!isAuthenticated && (
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push('/(auth)/signin')}
            >
              <Text style={styles.signInButtonText}>Sign In to Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  dateInfo: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#64748b',
  },
  todayBadge: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 4,
  },
  nextArrow: {
    fontSize: 24,
    color: '#2563eb',
  },
  entryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  entryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  wordCount: {
    fontSize: 14,
    color: '#64748b',
  },
  textInput: {
    minHeight: 300,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#d97706',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
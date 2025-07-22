import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Save, Calendar, ArrowLeft } from 'lucide-react-native';
import { saveDiaryEntry, loadDiaryEntry, getCurrentUser } from '../../supabase/client';

export default function DiaryTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
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
        Alert.alert(
          'Sign In Required',
          'Please sign in to access your diary entries.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => router.push('/(auth)/signin') }
          ]
        );
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
        // Don't show error for "not found" - just means no entry exists yet
        if (!error.message.includes('No rows found')) {
          Alert.alert('Error', 'Failed to load diary entry. Please try again.');
        }
        setDiaryEntry('');
      } else {
        setDiaryEntry(data || '');
      }
    } catch (error) {
      console.error('Exception loading diary entry:', error);
      Alert.alert('Error', 'Failed to load diary entry. Please try again.');
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading diary entry...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              <ArrowLeft size={24} color="#2563eb" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.entryContainer}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryLabel}>How was your day?</Text>
            <Text style={styles.wordCount}>{wordCount} words</Text>
          </View>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={diaryEntry}
              onChangeText={setDiaryEntry}
              placeholder="Write about your thoughts, experiences, and reflections from today..."
              multiline
              textAlignVertical="top"
              maxLength={10000}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={saveDiaryEntryToSupabase}
            disabled={isSaving || !isAuthenticated}
          >
            <Save size={20} color="#ffffff" style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Entry'}
            </Text>
          </TouchableOpacity>

          {!isAuthenticated && (
            <View style={styles.authWarning}>
              <Text style={styles.authWarningText}>
                Sign in to save your diary entries and sync across devices
              </Text>
              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push('/(auth)/signin')}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
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
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    textAlign: 'center',
  },
  todayBadge: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
  },
  entryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  textInput: {
    minHeight: 300,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  authWarning: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  authWarningText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 12,
  },
  signInButton: {
    backgroundColor: '#d97706',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
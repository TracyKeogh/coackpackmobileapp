import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Save, Calendar, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DiaryTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntry, setDiaryEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (params.date) {
      setSelectedDate(new Date(params.date as string));
    }
  }, [params.date]);

  useEffect(() => {
    loadDiaryEntry();
  }, [selectedDate]);

  useEffect(() => {
    const words = diaryEntry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [diaryEntry]);

  const loadDiaryEntry = async () => {
    try {
      const dateKey = formatDate(selectedDate);
      const entries = await AsyncStorage.getItem('diaryEntries');
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        setDiaryEntry(parsedEntries[dateKey] || '');
      }
    } catch (error) {
      console.error('Error loading diary entry:', error);
    }
  };

  const saveDiaryEntry = async () => {
    setIsLoading(true);
    try {
      const dateKey = formatDate(selectedDate);
      const entries = await AsyncStorage.getItem('diaryEntries');
      const parsedEntries = entries ? JSON.parse(entries) : {};
      
      parsedEntries[dateKey] = diaryEntry;
      await AsyncStorage.setItem('diaryEntries', JSON.stringify(parsedEntries));
      
      Alert.alert('Success', 'Diary entry saved successfully!');
    } catch (error) {
      console.error('Error saving diary entry:', error);
      Alert.alert('Error', 'Failed to save diary entry. Please try again.');
    } finally {
      setIsLoading(false);
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

  const navigateDate = (direction: string) => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (direction === 'next') {
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
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={saveDiaryEntry}
            disabled={isLoading}
          >
            <Save size={20} color="#ffffff" style={styles.saveIcon} />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
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
});
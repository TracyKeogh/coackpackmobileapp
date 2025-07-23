import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Save, Calendar } from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntry, setDiaryEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadDiaryEntry();
    }
  }, [selectedDate, user]);

  useEffect(() => {
    const words = diaryEntry.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(diaryEntry.trim() === '' ? 0 : words.length);
  }, [diaryEntry]);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const loadDiaryEntry = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const dateKey = formatDate(selectedDate);
      const { data, error } = await supabase
        .from('user_notes')
        .select('content')
        .eq('user_id', user.id)
        .eq('note_type', 'diary')
        .eq('date', dateKey)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading diary entry:', error);
        throw error;
      }

      setDiaryEntry(data?.content || '');
    } catch (error) {
      console.error('Error loading diary entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDiaryEntry = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to save your diary entry.');
      return;
    }

    setIsLoading(true);
    try {
      const dateKey = formatDate(selectedDate);
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('user_notes')
        .upsert({
          user_id: user.id,
          note_type: 'diary',
          date: dateKey,
          content: diaryEntry,
          created_at: now,
          updated_at: now,
        });

      if (error) {
        console.error('Error saving diary entry:', error);
        throw error;
      }

      Alert.alert('Success', 'Diary entry saved successfully!');
    } catch (error) {
      console.error('Error saving diary entry:', error);
      Alert.alert('Error', 'Failed to save diary entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Sign In Required</Text>
          <Text style={styles.authDescription}>
            Please sign in to access your diary entries.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.dateInfo}>
          <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
          {isToday(selectedDate) && <Text style={styles.todayBadge}>Today</Text>}
        </View>
        <TouchableOpacity style={styles.calendarButton}>
          <Calendar size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.editorContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="What happened today? Share your thoughts, feelings, and experiences..."
            placeholderTextColor="#9ca3af"
            value={diaryEntry}
            onChangeText={setDiaryEntry}
            multiline
            textAlignVertical="top"
            autoFocus={!diaryEntry}
          />
        </View>

        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {wordCount} words • {diaryEntry.length} characters
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={saveDiaryEntry}
          disabled={isLoading}
        >
          <Save size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  authDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  calendarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  dateInfo: {
    alignItems: 'flex-start',
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  todayBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  editorContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlignVertical: 'top',
  },
  stats: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
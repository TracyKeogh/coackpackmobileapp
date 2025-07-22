import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Save, Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { supabase } from '../../supabase/client';

export default function DiaryTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntry, setDiaryEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (params.date) {
      setSelectedDate(new Date(params.date as string));
    }
  }, [params.date]);

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
    setWordCount(words.length);
  }, [diaryEntry]);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (!user) {
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
      
      setUser(user);
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Authentication failed. Please try again.');
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
      Alert.alert('Error', 'Failed to load diary entry.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDiaryEntry = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to save your diary entry.');
      return;
    }

    setIsSaving(true);
    try {
      const dateKey = formatDate(selectedDate);
      const { error } = await supabase
        .from('user_notes')
        .upsert({
          user_id: user.id,
          note_type: 'diary',
          date: dateKey,
          content: diaryEntry,
          updated_at: new Date().toISOString()
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

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const navigateToCalendar = () => {
    router.push('/');
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Sign In Required</Text>
          <Text style={styles.authDescription}>
            Please sign in to access your diary entries and sync with your Coach Pack account.
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToCalendar} style={styles.backButton}>
          <ArrowLeft size={24} color="#2563eb" />
        </TouchableOpacity>
        
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateDate('prev')}
          >
            <ChevronLeft size={20} color="#6b7280" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToToday} style={styles.dateInfo}>
            <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
            {isToday(selectedDate) && <Text style={styles.todayBadge}>Today</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateDate('next')}
          >
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={navigateToCalendar} style={styles.calendarButton}>
          <Calendar size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="What happened today? Share your thoughts, feelings, and experiences..."
              placeholderTextColor="#94a3b8"
              value={diaryEntry}
              onChangeText={setDiaryEntry}
              multiline
              textAlignVertical="top"
              autoFocus={!diaryEntry}
              editable={!isSaving}
            />
          </View>
        )}

        <View style={styles.stats}>
          <Text style={styles.statsText}>
            {wordCount} words • {diaryEntry.length} characters
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (isLoading || isSaving) && styles.saveButtonDisabled]}
          onPress={saveDiaryEntry}
          disabled={isLoading || isSaving}
        >
          <Save size={20} color="#ffffff" />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  calendarButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  dateInfo: {
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  todayBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8b5cf6',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  authDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  editorContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
    color: '#1f2937',
    minHeight: 400,
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
    color: '#64748b',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
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
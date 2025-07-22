import React, { useState, useEffect } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Save, Calendar, ArrowLeft } from 'lucide-react-native';
import { supabase } from '../../supabase/client';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DiaryTab() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMountedRef = useRef(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntry, setDiaryEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    isMountedRef.current = true;
    if (params.date) {
      setSelectedDate(new Date(params.date as string));
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [params.date]);

  useEffect(() => {
    checkAuthAndLoadEntry();
  }, [selectedDate]);

  useEffect(() => {
    const words = diaryEntry.trim().split(/\s+/).filter(word => word.length > 0);
    if (isMountedRef.current) {
      setWordCount(words.length);
    }
  }, [diaryEntry]);

  const checkAuthAndLoadEntry = async () => {
    if (!isMountedRef.current) return;
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!user) {
        if (isMountedRef.current) {
          setCurrentUser(null);
        }
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
      
      if (isMountedRef.current) {
        setCurrentUser(user);
      }
      await loadDiaryEntryFromSupabase(user);
    } catch (error) {
      console.error('Auth check failed:', error);
      if (isMountedRef.current) {
        setCurrentUser(null);
      }
    }
  };

  const loadDiaryEntryFromSupabase = async (user: any) => {
    if (!isMountedRef.current) return;
    
    if (isMountedRef.current) {
      setIsLoading(true);
    }
    try {
      const dateKey = formatDate(selectedDate);
      
      const { data, error } = await supabase
        .from('user_notes')
        .select('content')
        .eq('user_id', user.id)
        .eq('note_type', 'diary')
        .eq('note_key', dateKey)
        .single();

      if (error && error.code === 'PGRST116') {
        // No entry found, just set empty
        if (isMountedRef.current) {
          setDiaryEntry('');
        }
      } else if (error) {
        console.error('Error loading diary entry:', error);
        Alert.alert('Error', 'Failed to load diary entry. Please try again.');
        if (isMountedRef.current) {
          setDiaryEntry('');
        }
      } else {
        if (isMountedRef.current) {
          setDiaryEntry(data?.content || '');
        }
      }
    } catch (error) {
      console.error('Exception loading diary entry:', error);
      Alert.alert('Error', 'Failed to load diary entry. Please try again.');
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const saveDiaryEntryToSupabase = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'Please sign in to save your diary entry.');
      return;
    }

    if (isMountedRef.current) {
      setIsSaving(true);
    }
    try {
      const dateKey = formatDate(selectedDate);
      
      const { error } = await supabase
        .from('user_notes')
        .upsert({
          user_id: currentUser.id,
          note_type: 'diary',
          note_key: dateKey,
          content: diaryEntry,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,note_type,note_key'
        });

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
      if (isMountedRef.current) {
        setIsSaving(false);
      }
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

  return (
    <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <ArrowLeft size={24} color="#4CAF50" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToToday} style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
          {formatDate(selectedDate) === formatDate(new Date()) && (
            <Text style={styles.todayBadge}>Today</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <ArrowLeft size={24} color="#4CAF50" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      </View>

      <View style={styles.editorContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your diary entry...</Text>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.textEditor}
              value={diaryEntry}
              onChangeText={setDiaryEntry}
              placeholder="Write your thoughts for today..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              editable={!!currentUser}
            />
            
            <View style={styles.footer}>
              <Text style={styles.wordCount}>{wordCount} words</Text>
              
              <TouchableOpacity 
                style={[styles.saveButton, (!currentUser || isSaving) && styles.saveButtonDisabled]} 
                onPress={saveDiaryEntryToSupabase}
                disabled={!currentUser || isSaving}
              >
                <Save size={20} color="white" />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity 
        style={styles.calendarButton}
        onPress={() => router.push('/(tabs)/calendar')}
      >
        <Calendar size={20} color="#4CAF50" />
        <Text style={styles.calendarButtonText}>Back to Calendar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navButton: {
    padding: 10,
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  todayBadge: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  textEditor: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  wordCount: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  calendarButtonText: {
    fontSize: 16,
    color: '#4CAF50',
  },
});
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
    if (direction === '
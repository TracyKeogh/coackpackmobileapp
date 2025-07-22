import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus, X, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface TimeSlot {
  time: string;
  period: string;
  entries: string[];
}

interface Action {
  id: string;
  title: string;
  duration: string;
  frequency: string;
  category: 'health' | 'work' | 'personal' | 'learning';
  color: string;
}

const ACTION_POOL: Action[] = [
  {
    id: '1',
    title: 'Exercise for 30 minutes',
    duration: '30m',
    frequency: '3x_week',
    category: 'health',
    color: '#dcfce7'
  },
  {
    id: '2',
    title: 'Write weekly newsletter',
    duration: '60m',
    frequency: 'weekly',
    category: 'work',
    color: '#dbeafe'
  },
  {
    id: '3',
    title: 'Meal prep on Sundays',
    duration: '120m',
    frequency: 'weekly',
    category: 'health',
    color: '#dcfce7'
  },
  {
    id: '4',
    title: 'Dedicate 30 minutes to a hobby',
    duration: '45m',
    frequency: '3x_week',
    category: 'personal',
    color: '#f3e8ff'
  },
  {
    id: '5',
    title: 'Schedule quality time with loved ones',
    duration: '90m',
    frequency: 'weekly',
    category: 'personal',
    color: '#f3e8ff'
  },
  {
    id: '6',
    title: 'Reach out to 3 potential clients',
    duration: '60m',
    frequency: 'weekly',
    category: 'work',
    color: '#dbeafe'
  },
  {
    id: '7',
    title: 'Practice mindfulness meditation',
    duration: '20m',
    frequency: 'daily',
    category: 'personal',
    color: '#f3e8ff'
  },
  {
    id: '8',
    title: 'No screens 1 hour before bed',
    duration: '60m',
    frequency: 'daily',
    category: 'health',
    color: '#dcfce7'
  },
  {
    id: '9',
    title: 'Review metrics and adjust strategy',
    duration: '45m',
    frequency: 'weekly',
    category: 'work',
    color: '#dbeafe'
  }
];

export default function DailyFocusTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState('');
  const [showActionPool, setShowActionPool] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    generateTimeSlots();
    loadDailyEntries();
  }, [currentDate]);

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    
    // Generate hourly slots from 6:00 AM to 11:00 PM
    for (let hour = 6; hour <= 23; hour++) {
      const time = hour > 12 ? (hour - 12).toString() : hour.toString();
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayTime = hour === 12 ? '12' : time;
      
      slots.push({
        time: `${displayTime}:00`,
        period,
        entries: []
      });
    }
    
    setTimeSlots(slots);
  };

  const loadDailyEntries = async () => {
    try {
      const dateKey = formatDate(currentDate);
      const entries = await AsyncStorage.getItem(`dailyEntries_${dateKey}`);
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        setTimeSlots(prevSlots => 
          prevSlots.map(slot => ({
            ...slot,
            entries: parsedEntries[`${slot.time}_${slot.period}`] || []
          }))
        );
      }
    } catch (error) {
      console.error('Error loading daily entries:', error);
    }
  };

  const saveDailyEntries = async (updatedSlots: TimeSlot[]) => {
    try {
      const dateKey = formatDate(currentDate);
      const entriesToSave: {[key: string]: string[]} = {};
      
      updatedSlots.forEach(slot => {
        entriesToSave[`${slot.time}_${slot.period}`] = slot.entries;
      });
      
      await AsyncStorage.setItem(`dailyEntries_${dateKey}`, JSON.stringify(entriesToSave));
    } catch (error) {
      console.error('Error saving daily entries:', error);
    }
  };

  const addEntry = (timeKey: string, entry: string) => {
    if (entry.trim()) {
      const updatedSlots = timeSlots.map(slot => {
        if (`${slot.time}_${slot.period}` === timeKey) {
          return { ...slot, entries: [...slot.entries, entry.trim()] };
        }
        return slot;
      });
      
      setTimeSlots(updatedSlots);
      saveDailyEntries(updatedSlots);
      setNewEntry('');
      setEditingSlot(null);
    }
  };

  const addActionFromPool = (action: Action) => {
    if (selectedTimeSlot) {
      addEntry(selectedTimeSlot, action.title);
      setShowActionPool(false);
      setSelectedTimeSlot(null);
    }
  };

  const removeEntry = (timeKey: string, entryIndex: number) => {
    const updatedSlots = timeSlots.map(slot => {
      if (`${slot.time}_${slot.period}` === timeKey) {
        return { 
          ...slot, 
          entries: slot.entries.filter((_, index) => index !== entryIndex) 
        };
      }
      return slot;
    });
    
    setTimeSlots(updatedSlots);
    saveDailyEntries(updatedSlots);
  };

  const openActionPool = (timeKey: string) => {
    setSelectedTimeSlot(timeKey);
    setShowActionPool(true);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return '#dcfce7';
      case 'work': return '#dbeafe';
      case 'personal': return '#f3e8ff';
      case 'learning': return '#fef3c7';
      default: return '#f1f5f9';
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateDate('prev')} style={styles.navButton}>
          <ChevronLeft size={24} color="#2563eb" />
        </TouchableOpacity>
        <View style={styles.dateInfo}>
          <Text style={styles.title}>Daily Focus</Text>
          <Text style={styles.dateText}>{formatDisplayDate(currentDate)}</Text>
          {isToday(currentDate) && <Text style={styles.todayBadge}>Today</Text>}
        </View>
        <TouchableOpacity onPress={() => navigateDate('next')} style={styles.navButton}>
          <ChevronRight size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.schedule} showsVerticalScrollIndicator={false}>
        {timeSlots.map((slot, index) => {
          const timeKey = `${slot.time}_${slot.period}`;
          const isEditing = editingSlot === timeKey;
          
          return (
            <View key={timeKey} style={styles.timeSlot}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{slot.time}</Text>
                <Text style={styles.periodText}>{slot.period}</Text>
              </View>
              
              <View style={styles.contentColumn}>
                {slot.entries.length === 0 && !isEditing ? (
                  <TouchableOpacity 
                    style={styles.dropZone}
                    onPress={() => setEditingSlot(timeKey)}
                  >
                    <Text style={styles.dropText}>Tap to add task</Text>
                    <Plus size={16} color="#94a3b8" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.entriesContainer}>
                    {slot.entries.map((entry, entryIndex) => (
                      <TouchableOpacity
                        key={entryIndex}
                        style={styles.entryItem}
                        onLongPress={() => removeEntry(timeKey, entryIndex)}
                      >
                        <Text style={styles.entryText}>{entry}</Text>
                        <Text style={styles.deleteHint}>Long press to delete</Text>
                      </TouchableOpacity>
                    ))}
                    
                    {isEditing ? (
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Add custom task..."
                          placeholderTextColor="#94a3b8"
                          value={newEntry}
                          onChangeText={setNewEntry}
                          onSubmitEditing={() => addEntry(timeKey, newEntry)}
                          autoFocus
                          multiline
                        />
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => addEntry(timeKey, newEntry)}
                        >
                          <Plus size={16} color="#2563eb" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.addButtonsContainer}>
                        <TouchableOpacity
                          style={styles.addMoreButton}
                          onPress={() => openActionPool(timeKey)}
                        >
                          <Plus size={16} color="#2563eb" />
                          <Text style={styles.addMoreText}>From Actions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.addCustomButton}
                          onPress={() => setEditingSlot(timeKey)}
                        >
                          <Text style={styles.addCustomText}>Custom</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Action Pool Modal */}
      <Modal
        visible={showActionPool}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowActionPool(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Action Pool</Text>
            <TouchableOpacity onPress={() => setShowActionPool(false)}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.actionsList} showsVerticalScrollIndicator={false}>
            {ACTION_POOL.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionItem, { backgroundColor: action.color }]}
                onPress={() => addActionFromPool(action)}
              >
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <View style={styles.actionMeta}>
                    <View style={styles.actionMetaItem}>
                      <Clock size={12} color="#64748b" />
                      <Text style={styles.actionMetaText}>{action.duration}</Text>
                    </View>
                    <Text style={styles.actionFrequency}>{action.frequency}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: 40,
  },
  navButton: {
    padding: 8,
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  todayBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  schedule: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  timeSlot: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 80,
  },
  timeColumn: {
    width: 80,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  periodText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  contentColumn: {
    flex: 1,
    padding: 16,
  },
  dropZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 8,
    minHeight: 48,
    gap: 8,
  },
  dropText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  entriesContainer: {
    gap: 8,
  },
  entryItem: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  entryText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  deleteHint: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 32,
    textAlignVertical: 'top',
  },
  addButton: {
    padding: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 6,
  },
  addButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addMoreButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 8,
    gap: 4,
  },
  addMoreText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  addCustomButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
  },
  addCustomText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  actionsList: {
    flex: 1,
    padding: 16,
  },
  actionItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionContent: {
    gap: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionMetaText: {
    fontSize: 12,
    color: '#64748b',
  },
  actionFrequency: {
    fontSize: 12,
    color: '#64748b',
  },
});
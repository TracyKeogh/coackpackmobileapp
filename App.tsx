import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [text, setText] = useState('');
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Diary</Text>
        <Text style={styles.date}>Tuesday, September 30, 2025</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="What happened today?"
          value={text}
          onChangeText={setText}
          multiline
        />
        
        <Text style={styles.wordCount}>{text.length} characters</Text>
      </ScrollView>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save Entry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 300,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  wordCount: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
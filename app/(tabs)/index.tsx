import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../../supabase/client';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Coach Pack Mobile</Text>
      <Text style={styles.subtitle}>Your daily planning companion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
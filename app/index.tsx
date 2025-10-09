import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Calendar, Target } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Clock size={64} color="#0f172a" strokeWidth={2.5} />
        </View>

        <Text style={styles.title}>Your Time,{'\n'}Intentionally Spent</Text>

        <Text style={styles.subtitle}>
          Fill your daily diary with intentional moments. Every hour matters when you're tracking your most valuable asset.
        </Text>

        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <Calendar size={24} color="#0f172a" strokeWidth={2} />
            <Text style={styles.featureText}>Daily tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Target size={24} color="#0f172a" strokeWidth={2} />
            <Text style={styles.featureText}>Intentional living</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/signup')}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>Start Your Journey</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/signin')}
          activeOpacity={0.9}
        >
          <Text style={styles.secondaryButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.decorativeBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbbf24',
  },
  heroSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: height * 0.12,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 56,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 64,
    marginBottom: 24,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: '#1e293b',
    lineHeight: 32,
    marginBottom: 48,
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  actionSection: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  decorativeBar: {
    height: 6,
    backgroundColor: '#0f172a',
  },
});
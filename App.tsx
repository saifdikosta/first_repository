import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { NotificationProvider } from './contexts/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Recovery Assistant</Text>
            <Text style={styles.subtitle}>Your journey to recovery starts here</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Daily Motivation</Text>
            <Text style={styles.quote}>
              "Every day is a new opportunity to change your life."
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Enable Notifications</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Track Your Progress</Text>
            <Text style={styles.progressText}>Days Sober: 0</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Tracking</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resources</Text>
            <Text style={styles.resourceText}>
              Access helpful articles, videos, and community support to aid your recovery journey.
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Explore Resources</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a6da7',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  progressText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  resourceText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
    color: '#444',
  },
  button: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
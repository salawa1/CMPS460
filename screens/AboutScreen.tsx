import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About My Movie Collection</Text>
      <Text style={styles.text}>Name: Sam Alawadhi</Text>
      <Text style={styles.text}>
        Application Description: This app displays five different movies with a short
        description of each movie.
      </Text>
      <Text style={styles.text}>
        Purpose: To help users view a small movie collection and learn more about
        each one.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 15 },
});

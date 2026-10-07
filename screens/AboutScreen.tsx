import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About My Movie Collection</Text>
      <Text style={styles.text}>Name: Sam Alawadhi</Text>
      <Text style={styles.text}>
        Application Description: This app allows users to add, browse, and
        delete movies in a personal collection. Each movie includes a title,
        release year, and description.
      </Text>
      <Text style={styles.text}>
        Purpose: To help users organize a movie collection and save it
        between app sessions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 15 },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }: any) {
  const { movieTitle, year, description } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movieTitle}</Text>
      <Text style={styles.text}>Release Year: {year}</Text>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 15 },
});

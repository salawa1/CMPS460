import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';

export default function MoviesScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Movies</Text>

      <View style={styles.movie}>
        <Text style={styles.text}>Everything Everywhere All at Once - 2024</Text>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('Details', {
            movieTitle: "Everything Everywhere All at Once",
            year: 2024,
            description: "An exhausted Chinese-American immigrant mother who must save the multiverse while trying to finish her taxes and fix her family.",
          })}
        />
      </View>

      <View style={styles.movie}>
        <Text style={styles.text}>Parasite - 2019</Text>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('Details', {
            movieTitle: "Parasite",
            year: 2019,
            description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
          })}
        />
      </View>

      <View style={styles.movie}>
        <Text style={styles.text}>Black Swan - 2010</Text>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('Details', {
            movieTitle: "Black Swan",
            year: 2010,
            description: "A perfectionist ballerina who descends into madness while fighting for the lead role in Swan Lake.",
          })}
        />
      </View>

      <View style={styles.movie}>
        <Text style={styles.text}>Perks of Being a Wallflower - 2012</Text>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('Details', {
            movieTitle: "Perks of Being a Wallflower",
            year: 2012,
            description: "A introverted high school freshman named Charlie navigates trauma, mental health, and the turbulent waters of adolescence.",
          })}
        />
      </View>

      <View style={styles.movie}>
        <Text style={styles.text}>Interstellar - 2014</Text>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('Details', {
            movieTitle: "Interstellar",
            year: 2014,
            description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 28, marginBottom: 20 },
  movie: { marginBottom: 25 },
  text: { fontSize: 18, marginBottom: 10 },
});

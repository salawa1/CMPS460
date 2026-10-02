import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Movie Collection</Text>
      <Text style={styles.text}>
        Browse 5 movies and choose one to learn more about it.
      </Text>
      <View style={styles.button}>
        <Button
          title="View Movies"
          onPress={() => navigation.navigate('Movies')}
        />
      </View>
      <Button
        title="About"
        onPress={() => navigation.navigate('About')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 28, marginBottom: 20 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { marginBottom: 15 },
});

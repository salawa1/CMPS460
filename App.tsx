import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  StatusBar,
  Platform,
} from 'react-native';

function App(): React.JSX.Element {
  // State keeps track of the name, guest count, and registration status.
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(0);
  const [registered, setRegistered] = useState(false);

  const addGuest = () => {
    setGuests(guests + 1);
  };

  // Prevent the guest count from going below zero, like the lab inventory.
  const removeGuest = () => {
    if (guests > 0) {
      setGuests(guests - 1);
    }
  };

  const register = () => {
    setRegistered(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Event Registration</Text>

        <EventInfo name="Mobile Development Workshop" />

        {/* Show the form before registration and a summary afterward. */}
        {registered ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Registration Complete!</Text>
            <Text style={styles.item}>Name: {name}</Text>
            <Text style={styles.item}>Event: Mobile Development Workshop</Text>
            <Text style={styles.item}>Guests: {guests}</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Name</Text>

            {/* TextInput updates the name state when the user types. */}
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.sectionTitle}>Guests: {guests}</Text>

            <View style={styles.button}>
              <Button title="- Guest" onPress={removeGuest} />
            </View>

            <View style={styles.button}>
              <Button title="+ Guest" onPress={addGuest} />
            </View>

            <View style={styles.button}>
              <Button
                title="Register"
                onPress={register}
                disabled={name.trim() === ''}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// This reusable component receives the event name through props.
function EventInfo({ name }: { name: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Event</Text>
      <Text style={styles.item}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8dce6',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#213c60',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4b8e60',
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#213c60',
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginBottom: 10,
  },
});

export default App;

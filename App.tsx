import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type Entry = {
  id: string;
  photoUri: string;
  note: string;
  latitude: number;
  longitude: number;
  timestamp: string;
};

const STORAGE_KEY = '@location_journal_entries';

export default function App() {
  const [photoUri, setPhotoUri] = useState('');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadEntries() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          setEntries(JSON.parse(saved));
        }

        setLoaded(true);
      } catch {
        setMessage(
          'Could not load the journal. Reopen the app before saving.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  async function takePhoto() {
    setBusy(true);
    setMessage('');

    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setMessage(
          'Camera permission denied. Enable access in device settings.',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        setMessage('Photo captured.');
      }
    } catch (error) {
      console.log('Camera error:', error);
      setMessage('Could not take a photo. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function getLocation() {
    setBusy(true);
    setMessage('Getting location...');
    setCoords(null);

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setMessage(
          'Location permission denied. Enable access in device settings.',
        );
        return;
      }

      const result = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: false,
      });

      setCoords({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });

      setMessage('Location retrieved.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not get your location.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveEntry() {
    if (!photoUri || !coords || note.trim() === '') {
      setMessage('Take a photo, get your location, and enter a note.');
      return;
    }

    setBusy(true);
    setMessage('Saving entry...');

    try {
      if (!FileSystem.documentDirectory) {
        throw new Error('Photo storage is unavailable.');
      }

      const id = Date.now().toString();
      const destination =
        FileSystem.documentDirectory + 'journal-' + id + '.jpg';

      await FileSystem.copyAsync({
        from: photoUri,
        to: destination,
      });

      const entry: Entry = {
        id,
        photoUri: destination,
        note: note.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      };

      const updatedEntries = [entry, ...entries];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedEntries),
      );

      setEntries(updatedEntries);
      setPhotoUri('');
      setCoords(null);
      setNote('');
      setMessage('Journal entry saved.');
    } catch {
      setMessage('Could not save the entry. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading journal...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>My Location Journal</Text>

      <Button
        title={photoUri ? 'Retake Photo' : 'Open Camera'}
        onPress={takePhoto}
        disabled={busy}
      />

      {photoUri !== '' && (
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          resizeMode="contain"
        />
      )}

      <View style={styles.section}>
        <Button
          title="Get Current Location"
          onPress={getLocation}
          disabled={busy}
        />
      </View>

      {coords && (
        <View>
          <Text>Latitude: {coords.latitude.toFixed(5)}</Text>
          <Text>Longitude: {coords.longitude.toFixed(5)}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Write a journal note"
        placeholderTextColor="#666"
        value={note}
        onChangeText={setNote}
        multiline
        editable={!busy}
      />

      <Button
        title="Save Entry"
        onPress={saveEntry}
        disabled={busy || !loaded}
      />

      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subheading}>Saved Entries</Text>

      {entries.length === 0 && <Text>No entries yet.</Text>}

      {entries.map(entry => (
        <View key={entry.id} style={styles.entry}>
          <Image
            source={{ uri: entry.photoUri }}
            style={styles.photo}
            resizeMode="contain"
          />

          <Text style={styles.note}>{entry.note}</Text>
          <Text>{new Date(entry.timestamp).toLocaleString()}</Text>
          <Text>Latitude: {entry.latitude.toFixed(5)}</Text>
          <Text>Longitude: {entry.longitude.toFixed(5)}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  photo: {
    width: 180,
    height: 180,
    marginVertical: 12,
  },
  section: {
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 12,
    marginVertical: 16,
    minHeight: 70,
    textAlignVertical: 'top',
    color: '#222',
  },
  message: {
    marginVertical: 16,
  },
  entry: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  note: {
    fontSize: 18,
    marginBottom: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
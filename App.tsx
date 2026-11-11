import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleData from './data/teams.json';

type Team = {
  id: string;
  name: string;
  city: string;
  conference: string;
};

const STORAGE_KEY = 'favoriteTeams';

export default function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // loading indicator
        await new Promise<void>(resolve => {
          setTimeout(() => resolve(), 1000);
        });
        setTeams(sampleData.teams);

        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setFavorites(JSON.parse(saved));
        }
      } catch {
        Alert.alert('Could not load favorites.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function toggleFavorite(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter(favoriteId => favoriteId !== id)
      : [...favorites, id];

    setSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setFavorites(next);
    } catch {
      Alert.alert('Could not save favorites.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading teams...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>NFL Teams</Text>

      <FlatList
        data={teams}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.team}>{item.name}</Text>
            <Text>{item.city} • {item.conference}</Text>
            <Button
              title={
                favorites.includes(item.id)
                  ? 'Remove Favorite'
                  : 'Add Favorite'
              }
              onPress={() => toggleFavorite(item.id)}
              disabled={saving}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#eaf1f8',
    marginBottom: 10,
  },
  team: {
    fontSize: 18,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
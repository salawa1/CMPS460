import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleData from './data/teams.json';

// JSON file
type Player = {
  name: string;
  position: string;
  number: number;
};

type Team = {
  id: string;
  name: string;
  city: string;
  conference: string;
  players: Player[];
};

// info passed to cards
type TeamCardProps = {
  team: Team;
  expanded: boolean;
  favorite: boolean;
  saving: boolean;
  onSelect: () => void;
  onFavorite: () => void;
};

const teams: Team[] = sampleData.teams;
const STORAGE_KEY = 'favoriteTeams'; // for AsyncStorage to retrieve favorite team IDs

// FlatList to display every team
function TeamCard({
  team,
  expanded,
  favorite,
  saving,
  onSelect,
  onFavorite,
}: TeamCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.teamName}>{team.name}</Text>
      <Text style={styles.text}>
        {team.city} • {team.conference}
      </Text>

      <Button
        title={expanded ? 'Hide Players' : 'View Players'}
        accessibilityLabel={
          `${expanded ? 'Hide' : 'View'} players for ${team.name}`
        }
        onPress={onSelect}
      />

      {/* shows the players when card is expanded */}
      {expanded && (
        <View style={styles.players}>
          <Text style={styles.playerHeading}>Players</Text>
          {team.players.map(player => (
            <Text key={player.number} style={styles.text}>
              #{player.number} {player.name} — {player.position}
            </Text>
          ))}
        </View>
      )}

      {/* error handling: disable the favorite button while change is happening */}
      <View style={styles.favoriteButton}>
        <Button
          title={favorite ? 'Remove Favorite' : 'Add Favorite'}
          accessibilityLabel={
            `${favorite ? 'Unfavorite' : 'Favorite'} ${team.name}`
          }
          onPress={onFavorite}
          disabled={saving}
        />
      </View>
    </View>
  );
}

export default function App() {
  // selectedId stores open team's ID. null = no card open
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        // AsyncStorage returns a string for JSON.parse to turn back into array
        if (saved !== null) {
          setFavorites(JSON.parse(saved));
        }
      } catch {
        Alert.alert('Could not load favorites.');
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function toggleFavorite(id: string) {
    const nextFavorites = favorites.includes(id)
      ? favorites.filter(favoriteId => favoriteId !== id)
      : [...favorites, id];

    setSaving(true);
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextFavorites),
      );

      // error handling: updates the buttons and list order after the save
      setFavorites(nextFavorites);
    } catch {
      Alert.alert('Could not save favorites.');
    } finally {
      setSaving(false);
    }
  }

  // search ignores spaces and capitalization when finding info
  const query = search.trim().toLowerCase();
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(query) ||
    team.city.toLowerCase().includes(query)
  );

  const sortedTeams = [...filteredTeams].sort(
    (a, b) => favorites.indexOf(b.id) - favorites.indexOf(a.id),
  );

  // error handling
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>NFL Teams & Players</Text>

      <TextInput
        style={styles.input}
        placeholder="Search by name or city"
        placeholderTextColor="#666"
        accessibilityLabel="Search teams by name or city"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={sortedTeams}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.text}>No teams match your search.</Text>
        }
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            expanded={selectedId === item.id}
            favorite={favorites.includes(item.id)}
            saving={saving}
            onSelect={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
            onFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </View>
  );
}

// styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 55,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    color: '#222',
    padding: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#eaf1f8',
    padding: 14,
    marginBottom: 12,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  players: {
    marginTop: 12,
  },
  playerHeading: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  favoriteButton: {
    marginTop: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
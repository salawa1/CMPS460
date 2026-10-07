import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Movie {
  id: string;
  movieTitle: string;
  year: string;
  description: string;
}

export default function MoviesScreen({ navigation }: any) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const savedMovies = await AsyncStorage.getItem('movies');

        if (savedMovies !== null) {
          setMovies(JSON.parse(savedMovies));
        }

        setLoaded(true);
      } catch (error) {
        console.log('Error loading movies:', error);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const saveMovies = async () => {
      try {
        await AsyncStorage.setItem(
          'movies',
          JSON.stringify(movies),
        );
      } catch (error) {
        console.log('Error saving movies:', error);
      }
    };

    if (loaded) {
      saveMovies();
    }
  }, [movies, loaded]);

  const addMovie = () => {
    if (
      movieTitle.trim() === '' ||
      year.trim() === '' ||
      description.trim() === ''
    ) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    const newMovie: Movie = {
      id: Date.now().toString(),
      movieTitle: movieTitle.trim(),
      year: year.trim(),
      description: description.trim(),
    };

    setMovies([...movies, newMovie]);

    setMovieTitle('');
    setYear('');
    setDescription('');
  };

  const deleteMovie = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Movie Collection</Text>

      <TextInput
        style={styles.input}
        placeholder="Movie title"
        value={movieTitle}
        onChangeText={setMovieTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Release year"
        value={year}
        onChangeText={setYear}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title="Add Movie"
        onPress={addMovie}
        disabled={!loaded}
      />

      <FlatList
        data={movies}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.text}>
            No movies have been added. Add your first movie!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.movie}>
            <Text style={styles.text}>{item.movieTitle}</Text>
            <Text style={styles.text}>Year: {item.year}</Text>

            <Button
              title="View Details"
              onPress={() =>
                navigation.navigate('Details', {
                  movieTitle: item.movieTitle,
                  year: item.year,
                  description: item.description,
                })
              }
            />

            <Button
              title="Delete"
              onPress={() => deleteMovie(item.id)}
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
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  movie: {
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Button, FlatList,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type RootStackParamList = {
  Home: undefined;
  Main: undefined;
  TaskDetails: { taskId: string };
};

type TabParamList = {
  Tasks: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const STORAGE_KEY = 'organizer_tasks';

// Reusable form component.
type FormFieldProps = {
  value: string;
  onChange: (text: string) => void;
};

function FormField({ value, onChange }: FormFieldProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Task title"
      accessibilityLabel="Task title"
      value={value}
      onChangeText={onChange}
    />
  );
}

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal Organizer</Text>
      <Button
        title="View Tasks"
        accessibilityLabel="Open tasks"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
}

type TasksProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Main'>;
  tasks: Task[];
  updateTasks: (tasks: Task[]) => void;
  saving: boolean;
  message: string;
};

function TasksScreen({
  navigation, tasks, updateTasks, saving, message,
}: TasksProps) {
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');

  const clearForm = () => {
    setTitle('');
    setEditingId('');
    setError('');
  };

  const saveTask = () => {
    if (title.trim() === '') {
      setError('Please enter a task title.');
      return;
    }

    if (editingId !== '') {
      updateTasks(tasks.map(task =>
        task.id === editingId ? { ...task, title: title.trim() } : task
      ));
    } else {
      updateTasks([...tasks, {
        id: `${Date.now()}-${Math.random()}`,
        title: title.trim(),
        completed: false,
      }]);
    }

    clearForm();
  };

  const editTask = (task: Task) => {
    setTitle(task.title);
    setEditingId(task.id);
    setError('');
  };

  const toggleTask = (id: string) => {
    updateTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          updateTasks(tasks.filter(task => task.id !== id));
          if (editingId === id) clearForm();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>
      <FormField value={title} onChange={setTitle} />

      {error !== '' && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      <Button
        title={editingId ? 'Save Changes' : 'Add Task'}
        accessibilityLabel={editingId ? 'Save changes' : 'Add task'}
        onPress={saveTask}
        disabled={saving}
      />

      {editingId !== '' && (
        <Button
          title="Cancel Edit"
          accessibilityLabel="Cancel editing"
          onPress={clearForm}
        />
      )}

      <Text style={styles.message} accessibilityLiveRegion="polite">
        {message}
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text>No tasks yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.completed ? 'Completed' : 'Not completed'}</Text>

            <View style={styles.buttons}>
              <Button
                title="Details"
                accessibilityLabel={`View ${item.title}`}
                onPress={() =>
                  navigation.navigate('TaskDetails', { taskId: item.id })
                }
              />
              <Button
                title="Edit"
                accessibilityLabel={`Edit ${item.title}`}
                onPress={() => editTask(item)}
                disabled={saving}
              />
              <Button
                title={item.completed ? 'Undo' : 'Complete'}
                accessibilityLabel={
                  `${item.completed ? 'Undo completion of' : 'Complete'} ${item.title}`
                }
                onPress={() => toggleTask(item.id)}
                disabled={saving}
              />
              <Button
                title="Delete"
                color="red"
                accessibilityLabel={`Delete ${item.title}`}
                onPress={() => deleteTask(item.id)}
                disabled={saving}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

type DetailsProps =
  NativeStackScreenProps<RootStackParamList, 'TaskDetails'> & {
    tasks: Task[];
  };

function TaskDetailsScreen({ route, navigation, tasks }: DetailsProps) {
  const task = tasks.find(item => item.id === route.params.taskId);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{task?.title || 'Task not found'}</Text>
      {task && (
        <>
          <Text>Task ID: {task.id}</Text>
          <Text>{task.completed ? 'Completed' : 'Not completed'}</Text>
        </>
      )}
      <Button
        title="Back to Tasks"
        accessibilityLabel="Back to tasks"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <Text>Tasks are saved automatically on this device.</Text>
    </View>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setTasks(JSON.parse(saved));
        setLoaded(true);
      } catch {
        setLoadError('Unable to load tasks. Please reopen the app.');
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const saveTasks = async () => {
      setSaving(true);
      setMessage('Saving...');
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        setMessage('Tasks saved.');
      } catch {
        setMessage('Save failed. Changes are not saved.');
      } finally {
        setSaving(false);
      }
    };
    saveTasks();
  }, [tasks, loaded]);

  if (loadError) {
    return <View style={styles.loading}><Text>{loadError}</Text></View>;
  }

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator accessibilityLabel="Loading tasks" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" options={{ title: 'Personal Organizer' }}>
          {({ navigation }) => (
            <Tab.Navigator screenOptions={{
              headerShown: false,
              tabBarIcon: () => null,
              tabBarIconStyle: { display: 'none' },
              tabBarLabelStyle: { fontSize: 16 },
            }}>
              <Tab.Screen
                name="Tasks"
                options={{ tabBarAccessibilityLabel: 'Tasks tab' }}
              >
                {() => (
                  <TasksScreen
                    navigation={navigation}
                    tasks={tasks}
                    updateTasks={setTasks}
                    saving={saving}
                    message={message}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ tabBarAccessibilityLabel: 'Settings tab' }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>
        <Stack.Screen name="TaskDetails" options={{ title: 'Task Details' }}>
          {props => <TaskDetailsScreen {...props} tasks={tasks} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 12,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  message: {
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
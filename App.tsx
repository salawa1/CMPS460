import React, { useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Task = {
  id: string;
  title: string;
};

type RootStackParamList = {
  Home: undefined;
  Tasks: undefined;
  TaskDetails: { taskId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Personal Organizer</Text>
      <Button
        title="View Tasks"
        onPress={() => navigation.navigate('Tasks')}
      />
    </SafeAreaView>
  );
}

type TasksProps = NativeStackScreenProps<RootStackParamList, 'Tasks'> & {
  tasks: Task[];
  addTask: (title: string) => void;
};

function TasksScreen({ navigation, tasks, addTask }: TasksProps) {
  const [taskInput, setTaskInput] = useState('');
  const [error, setError] = useState('');

  const handleAddTask = () => {
    const title = taskInput.trim();

    if (title === '') {
      setError('Please enter a task title.');
      return;
    }

    addTask(title);
    setTaskInput('');
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={taskInput}
        onChangeText={setTaskInput}
      />

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Button title="Add Task" onPress={handleAddTask} />

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text>No tasks yet. Add your first task!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Button
              title="View Details"
              onPress={() =>
                navigation.navigate('TaskDetails', {
                  taskId: item.id,
                })
              }
            />
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

function TaskDetailsScreen({
  route,
  navigation,
  tasks,
}: DetailsProps) {
  const task = tasks.find(item => item.id === route.params.taskId);

  return (
    <View style={styles.container}>
      {task ? (
        <>
          <Text style={styles.heading}>{task.title}</Text>
          <Text style={styles.taskTitle}>Task ID: {task.id}</Text>
        </>
      ) : (
        <Text style={styles.taskTitle}>Task not found.</Text>
      )}

      <Button
        title="Back to Tasks"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title,
    };

    setTasks(current => [...current, newTask]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Tasks">
          {props => (
            <TasksScreen
              {...props}
              tasks={tasks}
              addTask={addTask}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="TaskDetails"
          options={{ title: 'Task Details' }}
        >
          {props => (
            <TaskDetailsScreen {...props} tasks={tasks} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
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
  list: {
    flex: 1,
    marginTop: 20,
  },
  taskRow: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  taskTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
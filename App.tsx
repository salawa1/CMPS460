import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList,
  StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
};

const STORAGE_KEY = 'module7_expenses';
const categories = ['Food', 'Transport', 'School'];

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) setExpenses(JSON.parse(saved));
        setLoaded(true);
      } catch (error) {
        Alert.alert('Error', 'Unable to load expenses. Reopen the app.');
      }
    };
    loadExpenses();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY, JSON.stringify(expenses)
        );
      } catch (error) {
        Alert.alert('Error', 'Unable to save expenses.');
      }
    };
    saveExpenses();
  }, [expenses, loaded]);

  const saveExpense = () => {
    const expenseAmount = Number(amount);

    if (
      title.trim() === '' ||
      !Number.isFinite(expenseAmount) ||
      expenseAmount <= 0
    ) {
      Alert.alert('Enter a title and an amount greater than zero.');
      return;
    }

    if (editingId !== null) {
      setExpenses(current => current.map(expense =>
        expense.id === editingId
          ? { ...expense, title: title.trim(), amount: expenseAmount, category }
          : expense
      ));
    } else {
      const newExpense: Expense = {
        id: `${Date.now()}-${Math.random()}`,
        title: title.trim(),
        amount: expenseAmount,
        category
      };
      setExpenses(current => [...current, newExpense]);
    }

    setTitle('');
    setAmount('');
    setEditingId(null);
  };

  const editExpense = (expense: Expense) => {
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setEditingId(expense.id);
  };

  const deleteExpense = (id: string) => {
    setExpenses(current => current.filter(expense => expense.id !== id));

    if (editingId === id) {
      setTitle('');
      setAmount('');
      setEditingId(null);
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    filter === 'All' || expense.category === filter
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Expense Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text>Category: {category}</Text>

      <View style={styles.buttons}>
        {categories.map(value => (
          <Button
            key={value}
            title={value}
            onPress={() => setCategory(value)}
          />
        ))}
      </View>

      <Button
        title={editingId !== null ? 'Save Changes' : 'Add Expense'}
        onPress={saveExpense}
        disabled={!loaded}
      />

      <Text style={styles.label}>Filter: {filter}</Text>

      <View style={styles.buttons}>
        {['All', ...categories].map(value => (
          <Button
            key={value}
            title={value}
            onPress={() => setFilter(value)}
          />
        ))}
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text>No expenses to display.</Text>}
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
            <Text style={styles.expenseText}>
              {item.title} - ${item.amount.toFixed(2)}
            </Text>
            <Text>{item.category}</Text>

            <View style={styles.buttons}>
              <Button title="Edit" onPress={() => editExpense(item)} />
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteExpense(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 25, paddingTop: 70,
    backgroundColor: '#f4f4f4'
  },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: 'white', padding: 12, borderWidth: 1,
    borderColor: '#ccc', marginBottom: 12, borderRadius: 8
  },
  buttons: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 6, marginVertical: 10
  },
  label: { marginTop: 15 },
  expenseRow: {
    marginVertical: 8, padding: 10,
    backgroundColor: 'white', borderRadius: 8
  },
  expenseText: { fontSize: 16 }
});
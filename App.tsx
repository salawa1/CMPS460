import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.header}>My Profile</Text>

        <View style={styles.card}>
          <Text style={styles.name}>Sam Alawadhi</Text>
          <Text style={styles.subtext}>
            Residence Life Programming Coordinator | Office of Residence Life
          </Text>
          <Text style={styles.subtext}>
            Financial Coordinator | CAB
          </Text>
          <Text style={styles.subtext}>
            Tutor | Tutoring & Writing Center
          </Text>
        </View>

        <Education />

        <TechnicalSkills />

        <CareerGoals />

      </ScrollView>
    </SafeAreaView>
  );
}

function Education() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Education</Text>
      <Text style={styles.item}>Point Park University</Text>
      <Text style={styles.item}>
        B.S. Accounting & Applied Computer Science
      </Text>
      <Text style={styles.item}>Expected Graduation: May 2027</Text>
    </View>
  );
}

function TechnicalSkills() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Technical Skills</Text>
      <Text style={styles.item}>HTML & CSS</Text>
      <Text style={styles.item}>JavaScript</Text>
      <Text style={styles.item}>Accounting Software & Excel</Text>
    </View>
  );
}

function CareerGoals() {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Career Goals</Text>
      <Text style={styles.item}>
        Pursue CPA licensure in Pennsylvania and work in IT audit,
        combining my accounting and software development background.
      </Text>
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
    // optional: subtle shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // shadow on Android
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4b8e60',
  },
  subtext: {
    fontSize: 14,
    color: '#64748b',
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
});

export default App;
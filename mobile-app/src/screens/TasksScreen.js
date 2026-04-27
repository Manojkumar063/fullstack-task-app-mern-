import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { taskAPI } from '../services/api';

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    loadTasks();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={{ marginRight: 15 }}>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>AI Chat</Text>
        </TouchableOpacity>
      )
    });
  }, []);

  const loadTasks = async () => {
    try {
      const { data } = await taskAPI.getTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const { data } = await taskAPI.createTask(newTask);
      setTasks([data, ...tasks]);
      setNewTask('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await taskAPI.updateTask(id, !completed);
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTask(item._id, item.completed)} style={styles.taskContent}>
              <Text style={[styles.taskText, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item._id)}>
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 8, fontSize: 16 },
  addButton: { backgroundColor: '#007AFF', width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginLeft: 10 },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  taskItem: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  taskContent: { flex: 1 },
  taskText: { fontSize: 16 },
  completedTask: { textDecorationLine: 'line-through', color: '#999' },
  deleteButton: { color: '#ff3b30', fontSize: 20, fontWeight: 'bold', paddingLeft: 10 },
  logoutButton: { backgroundColor: '#ff3b30', padding: 15, borderRadius: 8, marginTop: 10 },
  logoutText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }
});

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { aiAPI } from '../services/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data } = await aiAPI.getChatHistory();
      setMessages(data.messages || []);
    } catch (error) {
      console.log('Failed to load history');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    
    try {
      const { data } = await aiAPI.chat(input);
      setMessages([...messages, userMessage, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages([...messages, userMessage, { role: 'assistant', content: 'Error: Failed to get response' }]);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.role === 'user' ? styles.userMessage : styles.aiMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask AI anything..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  message: { padding: 12, borderRadius: 8, marginVertical: 5, marginHorizontal: 10, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  messageText: { fontSize: 16, color: '#000' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  input: { flex: 1, backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16 },
  sendButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 8, marginLeft: 10 },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

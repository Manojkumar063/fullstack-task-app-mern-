import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/items', { name, description });
      setName('');
      setDescription('');
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>MERN App</h1>
      <form onSubmit={addItem}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from './pages/Main';
import React from 'react';
import Add from './pages/Add';
import List from './pages/List';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/add" element={<Add />} />
      <Route path="/list" element={<List />} />
      </Routes>
    </Router>
  )
}

export default App;

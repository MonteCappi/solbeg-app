import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ShowEmployees from './componets/ShowEmployees';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowEmployees></ShowEmployees>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

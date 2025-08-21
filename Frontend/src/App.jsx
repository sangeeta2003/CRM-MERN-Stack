import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import FormPage from './Components/FormPage/FormPage';
import TableView from './Components/TableView/TableView';
import Visualization from './Components/Visualization/Visualization';
import LoginPage from './Components/LoginPage/LoginPage';
import Dashboard from './Components/Dashboard/Dashboard';
import Contacts from './Components/Contacts/Contacts';

function App() {
  const [data, setData] = useState([]);

  const addData = (formData) => {
    setData([...data, formData]);
  };

  function RequireAuth({ children }) {
    const [isReady, setIsReady] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    useEffect(() => {
      const token = localStorage.getItem('token');
      setIsAuthed(!!token);
      setIsReady(true);
    }, []);
    if (!isReady) return null;
    return isAuthed ? children : <Navigate to="/" replace />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/form" element={<RequireAuth><FormPage addData={addData} /></RequireAuth>} />
        <Route path="/table-view" element={<RequireAuth><TableView data={data} /></RequireAuth>} />
        <Route path="/visualization" element={<RequireAuth><Visualization data={data} /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/contacts" element={<RequireAuth><Contacts /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;

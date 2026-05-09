import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import Issue from './pages/Issue';






function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        <Route path="/projects/:id" element={
            <PrivateRoute><Project /></PrivateRoute>
          }/>
      <Route path="/issues/:id" element={
        <PrivateRoute><Issue /></PrivateRoute>
      } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
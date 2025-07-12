import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Login } from './pages/Login.jsx';
import { Home } from './pages/Home.jsx';
import { MyProfile } from './pages/MyProfile.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ProductDetails } from './pages/ProductDetails.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
         <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/home' 
            element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
            <Route path='/myprofile' 
            element={<ProtectedRoute> <MyProfile /> </ProtectedRoute>} />
            <Route path='/products/:id' 
            element={<ProtectedRoute> <ProductDetails /> </ProtectedRoute>} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

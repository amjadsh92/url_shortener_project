/* eslint-disable */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';



import HomePage from './pages/homePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signupPage';


function App() {

  return (
    <Router>
      
        <Routes>
          <Route
            path="/"
            element={
              <HomePage  />
            }
          />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
         
        </Routes>
      
    </Router>

  )
  
}




export default App;

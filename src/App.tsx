import { Outlet } from 'react-router';
import './App.css';
import "react-toastify/dist/ReactToastify.css";
import Navbar from './Components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './Context/useAuth';


function App() {
  return (
    <div className="App bg-gray-900 min-h-screen text-white">
      <UserProvider>
        <Navbar />
        <Outlet />
        <ToastContainer />
      </UserProvider>
    </div>
  );
}
export default App;

import { Route, Routes } from 'react-router-dom';
import './App.css';
import DemoPuzzle from './components/jigsaw';
import Admin from './components/admin';
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DemoPuzzle />} />
        <Route path="/admin" element={<Admin />} />
        {/* Route for Admin component */}
      </Routes>
    </div>
  );
}

export default App;

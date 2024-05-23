import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import DemoPuzzle from './components/jigsaw';
import Admin from './components/admin';
function App() {
  return (
    <div>
      <h1>hello</h1>
      <div>
        <Link to='/admin'>Admin</Link>
        <br />
        <Link to="http://localhost:5173/?sx=250&sy=409&dx=250&dy=409&width=250&height=409&pieceIndex=1">Demo</Link>
      </div>
      <Routes>
        <Route path="/" element={<DemoPuzzle />} />
        <Route path="/admin" element={<Admin />} />
        {/* Route for Admin component */}
      </Routes>
    </div>
  );
}

export default App;

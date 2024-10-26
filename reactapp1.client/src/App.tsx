import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './screens/Home';
import Recipes from './screens/Recipes';
import './App.css'

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Main Page</Link>
                    </li>
                    <li>
                        <Link to="/recipes">Recipes</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
            </Routes>
        </Router>
    );
}

export default App;

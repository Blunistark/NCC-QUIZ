import { NavLink } from 'react-router-dom';
import { FaUser, FaTrophy, FaHome, FaBook, FaClipboardList } from 'react-icons/fa';
import '../styles/Navbar.css'; // Import the CSS file

const Navbar = () => {
    return (
        <nav className="navbar">
            <NavLink to="/profile" className="nav-item">
                <FaUser size={24} className="nav-icon" />
                <span>Profile</span>
            </NavLink>
            <NavLink to="/leaderboard" className="nav-item">
                <FaTrophy size={24} className="nav-icon" />
                <span>Leaderboard</span>
            </NavLink>
            <NavLink to="/home" className="nav-item">
                <FaHome size={24} className="nav-icon" />
                <span>Home</span>
            </NavLink>
            <NavLink to="/quiz" className="nav-item">
                <FaBook size={24} className="nav-icon" />
                <span>Quiz</span>
            </NavLink>
            <NavLink to="/mock-tests" className="nav-item">
                <FaClipboardList size={24} className="nav-icon" />
                <span>Mock Tests</span>
            </NavLink>
        </nav>
    );
};

export default Navbar;

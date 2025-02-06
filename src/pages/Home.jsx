import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css"; // Import CSS
import nccLogo from "../assets/ncc-logo.png"; // Import NCC logo
import cadetLogo from "../assets/cadet-logo.png"; // Import Cadet logo

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="logos-container">
                    <img src={nccLogo} alt="NCC Logo" className="ncc-logo" /> {/* NCC logo */}
                    <img src={cadetLogo} alt="Cadet Logo" className="cadet-logo" /> {/* Cadet logo */}
                </div>
                <h1 className="home-title">🏆 NCC Quiz Challenge</h1>
                <p className="home-subtitle">Test your knowledge & climb the leaderboard!</p>
                <Link to="/quiz" className="start-button">
                    Start Quiz 🚀
                </Link>
            </div>
            <footer className="footer">
                <p>Powered by Presidency University</p>
                <p>3 KAR BN NCC</p>
            </footer>
            <Navbar />
        </div>
    );
};

export default Home;

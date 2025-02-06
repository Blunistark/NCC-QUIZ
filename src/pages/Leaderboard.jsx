import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import "../styles/Leaderboard.css"; // Import CSS

const Leaderboard = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data, error } = await supabase
                .from("leaderboard")
                .select("user_id, score, timestamp")
                .order("score", { ascending: false })
                .limit(10);

            if (error) {
                console.error("Leaderboard fetch error:", error);
            } else {
                setScores(data);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">🏅 NCC Leaderboard</h1>
            <div className="leaderboard-card">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Cadet ID</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.length > 0 ? (
                            scores.map((entry, index) => (
                                <tr key={index} className={index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}>
                                    <td>#{index + 1}</td>
                                    <td>{entry.user_id}</td>
                                    <td>{entry.score}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="no-data">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Navbar />
        </div>
    );
};

export default Leaderboard;

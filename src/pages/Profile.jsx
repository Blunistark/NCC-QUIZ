import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);

            // Get current user session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session?.user) {
                console.error("User not authenticated:", sessionError);
                setLoading(false);
                return;
            }

            const userId = session.user.id; // Extract user ID

            console.log("Fetching profile for user ID:", userId); // Debugging log

            // Fetch user details from 'users' table
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single(); // Ensure only one record is returned

            if (error) {
                console.error("Profile fetch error:", error);
            } else {
                setProfile(data); // Set user profile
            }

            setLoading(false);
        };

        fetchProfile();
    }, []);

    return (
        <div className="profile-container">
            <h1 className="profile-title">NCC Cadet Profile</h1>
            {loading ? (
                <p className="loading-text">Loading profile...</p>
            ) : profile ? (
                <div className="profile-card">
                    <div className="profile-header">
                        <h2>{profile.name}</h2>
                        <span className="score">Score: {profile.score}</span>
                    </div>
                    <div className="profile-info">
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Regimental No:</strong> {profile.regimental_number}</p>
                        <p><strong>School:</strong> {profile.school}</p>
                        <p><strong>Unit:</strong> {profile.unit}</p>
                        <p><strong>Group:</strong> {profile.group}</p>
                        <p><strong>Directorate:</strong> {profile.directorate}</p>
                    </div>
                </div>
            ) : (
                <p className="no-profile">No profile found.</p>
            )}
            <Navbar />
        </div>
    );
};

export default Profile;

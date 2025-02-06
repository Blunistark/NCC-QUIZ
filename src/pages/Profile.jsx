import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import "../styles/Profile.css"; // Import the CSS file

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error("User not authenticated:", userError);
                return;
            }

            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Profile fetch error:", error);
            } else {
                setProfile(data);
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

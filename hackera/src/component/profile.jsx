import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  const getProfileImage = (email) => {
    return `https://robohash.org/${encodeURIComponent(email)}?set=set4&size=100x100`; 
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/getData",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.userRealData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserData();

    // Listen for an event triggered when the timer updates streak
    const handleStreakUpdate = () => fetchUserData();
    window.addEventListener("streakUpdated", handleStreakUpdate);

    return () => window.removeEventListener("streakUpdated", handleStreakUpdate);
  }, [token, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found. Please log in again.</div>;

  const profileImage = getProfileImage(user.email);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card text-center shadow" style={{ width: "24rem", borderRadius: "20px" }}>
        <div className="card-body">
          <div className="mb-4">
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                margin: "0 auto",
              }}
            />
          </div>

          <h5 className="card-title mb-1">{user.name}</h5>

          <div className="mb-3">
            <h6 className="text-primary mb-1">User Email</h6>
            <p className="text-muted">{user.email}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-success mb-1">🔥 Streak</h6>
            <p className="text-dark fw-bold">{user.streak} days</p>

            <h6 className="text-warning mb-1">⭐ Points</h6>
            <p className="text-dark fw-bold">{user.points} points</p>
          </div>

          
          {/* Logout Button */}
          <button className="btn btn-info w-100" onClick={() => {
            localStorage.removeItem("authToken");
            window.dispatchEvent(new Event("authChange"));
            navigate("/login");
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Explore() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/gettingData"); 
        console.log("API Response:", response.data);

        // Handle different response structures
        const fetchedRooms = response.data?.data || response.data || [];
        console.log("Processed Rooms:", fetchedRooms);

        setRooms(fetchedRooms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Normalize room types
  const groupRooms = rooms.filter(room => room.type?.trim().toLowerCase() === "group");
  const soloRooms = rooms.filter(room => room.type?.trim().toLowerCase() === "solo");

  useEffect(() => {
    console.log("Rooms Updated:", rooms);
  }, [rooms]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#d63384" }}>Explore Active Rooms</h1>
      <p style={{ color: "#6c757d" }}>
        Connect, collaborate, and learn together in virtual study rooms.
      </p>

      {loading ? (
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>Loading rooms...</p>
      ) : (
        <>
          <p>Rooms Loaded: {rooms.length}</p> 

          {groupRooms.length > 0 ? (
            <div>
              <h2 style={{ color: "#d63384" }}>Group Rooms</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", justifyContent: "center" }}>
                {groupRooms.map((room) => (
                  <div key={room._id} style={{ border: "1px solid #d63384", borderRadius: "10px", padding: "15px", textAlign: "center" }}>
                    <h5 style={{ color: "#d63384", marginBottom: "10px" }}>{room.name}</h5>
                    <p style={{ color: "#6c757d" }}>Type: {room.type}</p>
                    <button style={{ backgroundColor: "#d63384", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" }}>
                      Join Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No Group Rooms Available</p>
          )}

          {soloRooms.length > 0 ? (
            <div>
              <h2 style={{ color: "#d63384" }}>Solo Rooms</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", justifyContent: "center" }}>
                {soloRooms.map((room) => (
                  <div key={room._id} style={{ border: "1px solid #d63384", borderRadius: "10px", padding: "15px", textAlign: "center" }}>
                    <h5 style={{ color: "#d63384", marginBottom: "10px" }}>{room.name}</h5>
                    <p style={{ color: "#6c757d" }}>Type: {room.type}</p>
                    <button style={{ backgroundColor: "#d63384", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" }}>
                      Join Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No Solo Rooms Available</p>
          )}
        </>
      )}
    </div>
  );
}

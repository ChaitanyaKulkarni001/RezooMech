import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { ThemeContext } from "../ThemeContext";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useContext(ThemeContext);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("api/get-rooms/");
      setRooms(response.data);
    } catch (err) {
      setError("Error fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Container styling based on the theme
  const containerStyle = {
    backgroundColor: theme === "dim" ? "#1f2937" : "#f5f5f7",
    minHeight: "100vh",
    padding: "2rem",
    color: theme === "dim" ? "#000" : "#fff",
  };

  // Big box style for each room
  const boxStyle = {
    border: "2px solid #007aff",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    backgroundColor: theme === "dim" ? "#fff" : "#374151",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Available Debate Rooms</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {rooms.length === 0 && !loading ? (
        <p>No rooms available</p>
      ) : (
        rooms.map((room) => (
          <div key={room.id} style={boxStyle}>
            <p>
              <strong>Topic:</strong> {room.topic}
            </p>
            <p>
              <strong>User Side:</strong> {room.userSide}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Rooms;

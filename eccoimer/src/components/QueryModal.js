import React, { useState } from "react";

function QueryModal({ closeModal, addQuery, queries }) {
  const [query, setQuery] = useState(""); // State to store the query
  const [messages, setMessages] = useState(queries || []); // Initialize messages with queries

  // Handle the input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle sending the query
  const handleSendQuery = () => {
    if (query.trim()) {
      // Add the query to messages
      const newMessage = { text: query, sender: "User" };
      setMessages([...messages, newMessage]);

      // Add the query to the parent component via addQuery function
      addQuery(newMessage);

      setQuery(""); // Clear input after sending
    }
  };

  // Debugging: Ensure closeModal is being passed correctly
  console.log("closeModal function: ", closeModal);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        zIndex: 1000,
        border: "1px solid #ddd",
      }}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          fontSize: "16px",
          textAlign: "center",
          backgroundColor: "#001F3F",
          fontWeight: "bold",
          color: "#fff",
          borderRadius: "5px",
        }}
      >
        Query Chat
      </h3>

      {/* Display messages */}
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
          paddingRight: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "User" ? "flex-end" : "flex-start",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                backgroundColor: msg.sender === "User" ? "#dcf8c6" : "#ece5dd", // Green for user, gray for others
                padding: "10px 15px",
                borderRadius: "15px",
                fontSize: "14px",
                wordWrap: "break-word",
                lineHeight: "1.4",
                display: "inline-block",
              }}
            >
              <strong>{msg.sender}:</strong>
              <p style={{ margin: "5px 0 0 0" }}>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input for the query */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <textarea
          value={query}
          onChange={handleInputChange}
          placeholder="Type your query..."
          rows="2"
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "14px",
            resize: "none",
            marginRight: "10px",
            lineHeight: "1.4",
          }}
        />
        <button
          onClick={handleSendQuery}
          style={{
            backgroundColor: "#001F3F", // WhatsApp green
            color: "white",
            border: "none",
            borderRadius: "50%",
            padding: "12px",
            cursor: "pointer",
            fontSize: "20px",
            transition: "background-color 0.3s",
          }}
          title="Send Message"
        >
          &#10148;
        </button>
      </div>

      {/* Close button */}
      <div
        style={{
          position: "absolute",
          top: "2px",
          right: "5px",
          backgroundColor: "#001F3F",
          color: "white",
          border: "2px solid #001F3F",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
          fontSize: "18px",
        }}
        onClick={(e) => {
          e.stopPropagation(); // Prevent any propagation issues
          console.log("Close button clicked"); // Debugging
          closeModal(); // Ensure this function is being triggered
        }}
      >
        X
      </div>
    </div>
  );
}

export default QueryModal;

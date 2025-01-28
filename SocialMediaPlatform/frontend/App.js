App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("TestUser");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get("http://localhost:5000/posts");
    setPosts(response.data);
  };

  const createPost = async () => {
    await axios.post("http://localhost:5000/posts", {
      content,
      author: "63e28c...", // Example user ID (replace with actual logged-in user ID)
    });
    setContent("");
    fetchPosts();
  };

  return (
    <div className="App">
      <h1>Social Media Platform</h1>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        ></textarea>
        <button onClick={createPost}>Post</button>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p>{post.content}</p>
            <small>- {post.author.username}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

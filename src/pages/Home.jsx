import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/Storage";
import { FaTrash } from "react-icons/fa";

export default function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentText, setCommentText] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const savedPosts = getFromLocalStorage("posts") || [];
    const normalizedPosts = savedPosts.map(post => ({
      ...post,
      likes: Array.isArray(post.likes) ? post.likes : [],
      comments: Array.isArray(post.comments) ? post.comments : [],
    }));
    setPosts(normalizedPosts);
  }, []);

  const handlePost = e => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const newEntry = {
      id: Date.now(),
      username: user.username,
      content: newPost,
      likes: [],
      comments: [],
    };

    const updatedPosts = [newEntry, ...posts];
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
    setNewPost("");
  };

  const handleDelete = postId => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  const handleLike = postId => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likes.includes(user.username);
        return {
          ...post,
          likes: alreadyLiked
            ? post.likes.filter(u => u !== user.username)
            : [...post.likes, user.username],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  const handleComment = (postId, comment) => {
    if (!comment.trim()) return;
    const updatedPosts = posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [...post.comments, { user: user.username, text: comment }],
          }
        : post
    );
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  const handleDeleteComment = (postId, index) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComments = [...post.comments];
        newComments.splice(index, 1);
        return { ...post, comments: newComments };
      }
      return post;
    });
    setPosts(updatedPosts);
    saveToLocalStorage("posts", updatedPosts);
  };

  return (
    <Container className="py-4">
      <div className="d-flex gap-2 mb-3">
        <Button onClick={() => navigate("/posts")} variant="outline-primary">
          View All Posts 📜
        </Button>
        <Button onClick={() => navigate("/profile")} variant="outline-success">
          View Profile 👤
        </Button>
      </div>

      <Card className="p-3 mb-4 shadow-sm">
        <Form onSubmit={handlePost}>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="What's on your mind?"
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
          />
          <Button type="submit" className="mt-2 w-100 fw-bold" variant="primary">
            Post ✨
          </Button>
        </Form>
      </Card>

      {posts.length === 0 ? (
        <p className="text-muted text-center">No posts yet. Be the first to share!</p>
      ) : (
        posts.slice(0, 3).map(post => (
          <Card key={post.id} className="p-3 mb-3 shadow-sm">
            <h5 className="fw-bold mb-1">@{post.username}</h5>
            <p>{post.content}</p>

            <div className="d-flex gap-2 mb-2">
              {post.username === user.username && (
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(post.id)}>
                  <FaTrash /> Delete
                </Button>
              )}
              <Button
                size="sm"
                variant={post.likes.includes(user.username) ? "danger" : "outline-danger"}
                onClick={() => handleLike(post.id)}
              >
                ❤️ {post.likes.length}
              </Button>
            </div>

            {(post.comments || []).map((c, i) => (
              <div key={i} className="ms-3 mb-1 d-flex justify-content-between align-items-center">
                <p className="text-muted mb-0">
                  <strong>@{c.user}:</strong> {c.text}
                </p>
                {c.user === user.username && (
                  <Button size="sm" variant="outline-danger" onClick={() => handleDeleteComment(post.id, i)}>
                    <FaTrash />
                  </Button>
                )}
              </div>
            ))}

            <Form
              onSubmit={e => {
                e.preventDefault();
                handleComment(post.id, commentText[post.id] || "");
                setCommentText({ ...commentText, [post.id]: "" });
              }}
              className="d-flex mt-2"
            >
              <Form.Control
                type="text"
                placeholder="Add a comment..."
                value={commentText[post.id] || ""}
                onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
              />
              <Button type="submit" size="sm" disabled={!commentText[post.id]?.trim()}>
                Add
              </Button>
            </Form>
          </Card>
        ))
      )}
    </Container>
  );
}

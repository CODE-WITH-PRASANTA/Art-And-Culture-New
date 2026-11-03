import React, { useState } from 'react';
import './NewBlogPosting.css';

const NewBlogPosting = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    image: '',
    content: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle your API submission here
    console.log('Blog Post Submitted:', formData);
    setSubmitted(true);

    // Reset form after submission (optional)
    setTimeout(() => {
      setFormData({ title: '', category: 'Technology', image: '', content: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="blog-posting-container">
      <div className="blog-posting-card">
        <h2>Create a New Blog Post</h2>
        <p className="subtitle">Share your thoughts and ideas with the world.</p>

        {submitted && (
          <div className="success-message">
            🎉 Blog post published successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Coding">Coding</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Cover Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows="8"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog post content here..."
              required
            ></textarea>
          </div>

          <button type="submit" className="publish-btn">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewBlogPosting;
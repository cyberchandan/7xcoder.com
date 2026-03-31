import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./admin.css";

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http")) return url;
    return `${backendUrl}${url}`;
  };
  const [mode, setMode] = useState("blogs"); // or "careers"
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [comments, setComments] = useState(0);
  const [location, setLocation] = useState("");
  const [requirements, setRequirements] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  React.useEffect(() => {
    loadItems();
  }, [mode]);

  const loadItems = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${backendUrl}/api/${mode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      showMessage("Failed to load items", "error");
    }
  };

  const handleImageSelect = (file) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleImageChange = (e) => {
    handleImageSelect(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (mode !== "live-projects" && !description.trim()) {
      newErrors.description = "Description is required";
    }
    if (mode === "careers" && !location.trim()) {
      newErrors.location = "Location is required for career posts";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description);
    setDate(item.date ? item.date.split("T")[0] : "");
    if (mode === "blogs") setComments(item.comments || 0);
    if (mode === "careers") {
      setLocation(item.location || "");
      setRequirements(item.requirements || "");
    }
    if (mode === "live-projects") {
      setGithubLink(item.githubLink || "");
      setLiveLink(item.liveLink || "");
    }
    setImage(null);
    setImagePreview(getImageUrl(item.imageUrl));
    setErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setComments(0);
    setLocation("");
    setRequirements("");
    setGithubLink("");
    setLiveLink("");
    setImage(null);
    setImagePreview(null);
    setEditing(null);
    setShowForm(false);
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(
        `${backendUrl}/api/${mode}/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        showMessage(`${mode.slice(0, -1)} deleted successfully`, "success");
        loadItems();
      } else {
        showMessage("Failed to delete item", "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Network error", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showMessage("Please fix the errors above", "error");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("adminToken");
    let bodyData;
    let headersData = {
      Authorization: `Bearer ${token}`,
    };

    if (mode === "live-projects") {
      headersData["Content-Type"] = "application/json";
      bodyData = JSON.stringify({
        title,
        githubLink,
        liveLink
      });
    } else {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("date", date || new Date().toISOString().split("T")[0]);
      if (mode === "blogs") form.append("comments", comments);
      if (mode === "careers") {
        form.append("location", location);
        form.append("requirements", requirements);
      }
      if (image) form.append("image", image);
      bodyData = form;
    }

    try {
      const url = `${backendUrl}/api/${mode}${editing ? `/${editing._id}` : ""}`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: headersData,
        body: bodyData,
      });
      const data = await res.json();
      if (res.ok) {
        showMessage(
          `${mode.slice(0, -1)} ${editing ? "updated" : "created"} successfully! 🎉`,
          "success",
        );
        handleReset();
        loadItems();
      } else {
        showMessage(data.message || `Error saving ${mode}`, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Network error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <img src={logo} alt="7xcoder" className="admin-header-logo" />
        </div>
        <h1 className="admin-header-title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="admin-logout-btn">
          🚪 Logout
        </button>
      </header>

      {/* Main Container */}
      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div className="admin-nav-section">
            <h3>Content Management</h3>
            <div className="admin-tabs-vertical">
              <button
                className={`admin-tab-btn ${mode === "blogs" ? "active" : ""}`}
                onClick={() => {
                  setMode("blogs");
                  setShowForm(false);
                  handleReset();
                }}
              >
                📝 Blogs
              </button>
              <button
                className={`admin-tab-btn ${mode === "careers" ? "active" : ""}`}
                onClick={() => {
                  setMode("careers");
                  setShowForm(false);
                  handleReset();
                }}
              >
                💼 Careers
              </button>
              <button
                className={`admin-tab-btn ${mode === "live-projects" ? "active" : ""}`}
                onClick={() => {
                  setMode("live-projects");
                  setShowForm(false);
                  handleReset();
                }}
              >
                🚀 Live Projects
              </button>
            </div>
          </div>

          <div className="admin-nav-section">
            <button
              className="admin-add-new-btn"
              onClick={() => {
                if (showForm) {
                  handleReset();
                } else {
                  setShowForm(true);
                }
              }}
            >
              ✨ {showForm ? "Hide Form" : "Add New"}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          {/* Success/Error Message */}
          {message && (
            <div
              className={`admin-alert ${
                messageType === "success" ? "success" : "error"
              }`}
            >
              <span className="alert-icon">
                {messageType === "success" ? "✓" : "✕"}
              </span>
              {message}
              <button className="alert-close" onClick={() => setMessage("")}>
                ×
              </button>
            </div>
          )}

          {/* Top Stats */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <p className="stat-label">Total {mode}</p>
                <p className="stat-value">{items.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">{mode === "blogs" ? "📰" : "👥"}</div>
              <div className="stat-info">
                <p className="stat-label">Status</p>
                <p className="stat-value">Active</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="admin-form-section">
              <div className="admin-form-header">
                <h2>
                  {editing
                    ? `Edit ${mode.slice(0, -1)}`
                    : `Create New ${mode.slice(0, -1)}`}
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="admin-form"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">
                      Title *{" "}
                      {errors.title && (
                        <span className="error-text">{errors.title}</span>
                      )}
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (e.target.value.trim())
                          setErrors((prev) => ({ ...prev, title: "" }));
                      }}
                      placeholder="Enter title"
                      className={errors.title ? "input-error" : ""}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                {mode !== "live-projects" && (
                  <div className="form-group">
                    <label htmlFor="description">
                      Description *{" "}
                      {errors.description && (
                        <span className="error-text">{errors.description}</span>
                      )}
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (e.target.value.trim())
                          setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      placeholder="Enter detailed description"
                      rows="4"
                      className={errors.description ? "input-error" : ""}
                    />
                  </div>
                )}

                {mode === "blogs" && (
                  <div className="form-group">
                    <label htmlFor="comments">Comments</label>
                    <input
                      id="comments"
                      type="number"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      min="0"
                      placeholder="Number of comments"
                    />
                  </div>
                )}

                {mode === "careers" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="location">
                          Location *{" "}
                          {errors.location && (
                            <span className="error-text">
                              {errors.location}
                            </span>
                          )}
                        </label>
                        <input
                          id="location"
                          type="text"
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            if (e.target.value.trim())
                              setErrors((prev) => ({ ...prev, location: "" }));
                          }}
                          placeholder="Job location"
                          className={errors.location ? "input-error" : ""}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="requirements">Requirements</label>
                      <textarea
                        id="requirements"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Job requirements"
                        rows="3"
                      />
                    </div>
                  </>
                )}

                {mode === "live-projects" && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="githubLink">GitHub Link</label>
                        <input
                          id="githubLink"
                          type="url"
                          value={githubLink}
                          onChange={(e) => setGithubLink(e.target.value)}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="liveLink">Live Deploy Link</label>
                        <input
                          id="liveLink"
                          type="url"
                          value={liveLink}
                          onChange={(e) => setLiveLink(e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Image Upload Section */}
                {mode !== "live-projects" && (
                  <div className="form-group">
                    <label>
                    Image{" "}
                    {errors.image && (
                      <span className="error-text">{errors.image}</span>
                    )}
                  </label>
                  <div
                    className={`drag-drop-zone ${isDragging ? "dragging" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="drag-drop-content">
                      <div className="drag-drop-icon">📁</div>
                      <p className="drag-drop-text">
                        Drag and drop your image here, or click to select
                      </p>
                      <p className="drag-drop-hint">
                        Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                      </p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="file-input"
                    />
                  </div>
                  {imagePreview && (
                    <div className="image-preview-container">
                      <div className="image-preview-wrapper">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="image-preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <p className="preview-label">
                        {image ? "New image selected" : "Current image"}
                      </p>
                    </div>
                  )}
                </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Processing..."
                      : `${editing ? "✏️ Update" : "➕ Create"} ${mode.slice(0, -1)}`}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    ✖️ Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Section */}
          <div className="admin-list-section">
            <div className="admin-list-header">
              <h2>{mode.charAt(0).toUpperCase() + mode.slice(1)} List</h2>
              <span className="list-count">{items.length} items</span>
            </div>

            {items.length === 0 ? (
              <div className="admin-empty-state">
                <p>
                  No {mode} yet. Create your first {mode.slice(0, -1)}!
                </p>
              </div>
            ) : (
              <div className="admin-cards-grid">
                {items.map((item) => (
                  <div className="admin-item-card" key={item._id}>
                    {item.imageUrl && (
                      <div className="card-image">
                        <img 
                          src={getImageUrl(item.imageUrl)} 
                          alt={item.title} 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="card-content">
                      <h3>{item.title}</h3>
                      <p className="card-date">
                        📅 {new Date(item.date).toLocaleDateString()}
                      </p>
                      {mode === "blogs" && (
                        <p className="card-meta">
                          💬 {item.comments || 0} comments
                        </p>
                      )}
                      {mode === "careers" && (
                        <p className="card-meta">📍 {item.location}</p>
                      )}
                      {mode === "live-projects" && (
                        <>
                           {item.githubLink && <p className="card-meta">🔗 GitHub: <a href={item.githubLink} target="_blank" rel="noreferrer">View</a></p>}
                           {item.liveLink && <p className="card-meta">🌐 Live: <a href={item.liveLink} target="_blank" rel="noreferrer">View</a></p>}
                        </>
                      )}
                      {mode !== "live-projects" && (
                        <p className="card-description">
                          {item.description.substring(0, 60)}...
                        </p>
                      )}
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

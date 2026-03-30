import "./service_1.css";
import blogImg1 from "../../assets/blog/images/blog_1.png";
// import arrow from "../assets/images/arrow1.png";
import arrow from "../../assets/business-software-solutions/icon/arrow1.png";
import { useState } from "react";

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  return `${getBackendUrl()}${url}`;
};

const Service3_1 = ({ blogs = [] }) => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  // split data into latest two
  const latest = blogs.slice(0, 2);
  const isEmpty = blogs.length === 0;

  return (
    <div className="service_1_root-blog">
      <main className="hero-box-service1-blog">
        <div className="title-box-service1-blog">
          <h1 className="title2-service1-blog">Blog’s</h1>
          <p className="sub-title-service1-blog">Recent Post</p>
          <p className="service-para1-service1-blog">
            We share result driven digital marketing insights that help brands
            improve online visibility, increase audience engagement, and drive
            sustainable business growth through strategic SEO, social media
            marketing, and performance focused campaigns.
          </p>
        </div>

        {/* ===== BLOG CONTENT ===== */}
        {isEmpty ? (
          <p style={{ textAlign: "center", color: "#fff", marginTop: 40 }}>
            No blog posts available yet.
          </p>
        ) : (
          <div className="blog-content-sb1-blog">
            <div className="blog-cards-sb1-blog">
              {latest.map((blog) => (
                <div className="blog-card-sb1-blog" key={blog._id || blog.id}>
                  <div className="blog-img-container-sb1-blog">
                    <img
                      src={blog.imageUrl ? getImageUrl(blog.imageUrl) : (blog.image || blogImg1)}
                      alt={blog.title}
                      className="fit-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = blogImg1;
                      }}
                    />
                  </div>
                  <p className="blog-meta-sb1-blog">
                    {new Date(blog.date).toLocaleDateString()}{" "}
                    <span className="dot-separator-blog">•</span>{" "}
                    {blog.author || "Admin"}{" "}
                    <span className="dot-separator-blog">•</span>{" "}
                    {blog.comments || "No Comments"}
                  </p>
                  <p className="blog-desc-sb1-blog">{blog.title}</p>
                  <div className="read-more-wrapper-sb1-blog">
                    <button
                      className="read-more-btn-sb1-blog"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      Read More
                      <img
                        src={arrow}
                        alt="arrow"
                        className="read-more-icon-sb1-blog"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE DESCRIPTION */}
            <div className="blog-side-text-sb1-blog">
              <p>
                We share result driven digital marketing insights designed to
                help brands strengthen their online visibility, build meaningful
                audience engagement, and achieve sustainable business growth.
                Our content focuses on practical, data backed strategies across
                SEO, social media marketing, content creation, and performance
                focused campaigns. By combining industry expertise with real
                world experience, we aim to educate businesses on how to adapt
                to evolving digital trends, optimize their marketing efforts,
                and drive measurable results in an increasingly competitive
                digital landscape.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="blog-modal" onClick={() => setSelectedBlog(null)}>
          <div
            className="blog-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="blog-modal-close"
              onClick={() => setSelectedBlog(null)}
            >
              ×
            </button>
            {selectedBlog.imageUrl && (
              <img
                src={getImageUrl(selectedBlog.imageUrl)}
                alt={selectedBlog.title}
                className="blog-modal-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = blogImg1;
                }}
              />
            )}
            <h2 className="blog-modal-title">{selectedBlog.title}</h2>
            <p className="blog-modal-meta">
              {new Date(selectedBlog.date).toLocaleDateString()} •{" "}
              {selectedBlog.author || "Admin"} •{" "}
              {selectedBlog.comments || "No Comments"}
            </p>
            <p className="blog-modal-description">
              {selectedBlog.description || selectedBlog.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service3_1;

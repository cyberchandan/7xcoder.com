import React, { useEffect, useState } from "react";
import HomePage9 from "../Home/HomePage9";
import arrow from "../../assets/business-software-solutions/icon/arrow1.png";
import "./career.css";

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("http")) return url;
  return `${getBackendUrl()}${url}`;
};

const Career = () => {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/careers`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCareers();
  }, []);

  return (
    <div className="service_1_root-career">
      <main className="hero-box-service1-career">
        <div className="title-box-service1-career">
          <h1 className="title2-service1-career">Careers</h1>
          <p className="sub-title-service1-career">Join Our Team</p>
          <p className="service-para1-service1-career">
            Be part of a dynamic team dedicated to delivering innovative digital
            solutions. We're always looking for talented individuals who are
            passionate about technology, creativity, and excellence.
          </p>
        </div>

        <div className="career-content-sb1-career">
          <div className="career-cards-sb1-career">
            {posts.map((job) => (
              <div className="career-card-sb1-career" key={job._id}>
                {job.imageUrl && (
                  <div className="career-img-container-sb1-career">
                    <img
                      src={getImageUrl(job.imageUrl)}
                      alt={job.title}
                      className="fit-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <p className="career-meta-sb1-career">
                  {new Date(job.date).toLocaleDateString()}{" "}
                  <span className="dot-separator-career">•</span>{" "}
                  {job.location || "Not specified"}{" "}
                  <span className="dot-separator-career">•</span>{" "}
                  {job.requirements
                    ? job.requirements.split(/[,\n]+/)[0].trim()
                    : ""}
                </p>
                <p className="career-desc-sb1-career">{job.title}</p>
                <div className="view-details-wrapper-sb1-career">
                  <button
                    className="read-more-btn-sb1-blog "
                    onClick={() => setSelected(job)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="career-side-text-sb1-career">
            <h3>Why Work With Us?</h3>
            <div className="career-benefits">
              <div className="career-benefit-item">
                <div className="benefit-icon">🎯</div>
                <h4>Career Growth</h4>
                <p>
                  Continuous learning and professional development opportunities
                </p>
              </div>
              <div className="career-benefit-item">
                <div className="benefit-icon">🌟</div>
                <h4>Innovation</h4>
                <p>
                  Work with cutting-edge technologies and latest industry
                  practices
                </p>
              </div>
              <div className="career-benefit-item">
                <div className="benefit-icon">👥</div>
                <h4>Team Culture</h4>
                <p>
                  Collaborative environment with talented and friendly
                  colleagues
                </p>
              </div>
              <div className="career-benefit-item">
                <div className="benefit-icon">💰</div>
                <h4>Competitive Benefits</h4>
                <p>
                  Attractive salary packages, health insurance, and other perks
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <div className="career-modal" onClick={() => setSelected(null)}>
          <div
            className="career-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selected.title}</h2>
            <p className="modal-location">
              📍 {selected.location || "Not specified"}
            </p>
            <p className="modal-date">
              Posted: {new Date(selected.date).toLocaleDateString()}
            </p>
            <p>{selected.description}</p>
            {selected.requirements && (
              <>
                <h3>Requirements</h3>
                <p>{selected.requirements}</p>
              </>
            )}
            {selected.imageUrl && (
              <img 
                src={getImageUrl(selected.imageUrl)} 
                alt="" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      <HomePage9 />
    </div>
  );
};

export default Career;

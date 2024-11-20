import React from "react";
import PropTypes from "prop-types";
import { Button, Container, Row, Col } from "react-bootstrap";
import { AuthService } from "../../utils/authService";

const Cover = ({ name, coverImg }) => {
  const authService = new AuthService();

  if ((name, coverImg)) {
    return (
      <div
        className="d-flex justify-content-center flex-column"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
          minHeight: "100vh",
          color: "#fff"
        }}
      >
        <Container>
          <Row className="align-items-center" style={{ minHeight: "90vh" }}>
            <Col md={6} className="text-center text-md-start">
              <h1 className="display-4 fw-bold mb-4" style={{ color: "#00f6ff" }}>
                {name}
              </h1>
              <div className="mb-4 lead" style={{ color: "#e0e0e0" }}>
                <p>Decentralized Predictions, Real Rewards</p>
                <ul className="list-unstyled mt-4">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: "#00f6ff" }}></i>
                    Create and participate in prediction markets
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: "#00f6ff" }}></i>
                    Bet on outcomes with SUI tokens
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: "#00f6ff" }}></i>
                    Earn rewards for accurate predictions
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => authService.login()}
                variant="outline-light"
                className="rounded-pill px-4 py-2 mt-3"
                style={{
                  background: "linear-gradient(45deg, #00f6ff 0%, #0072ff 100%)",
                  border: "none",
                  fontSize: "1.1rem"
                }}
              >
                <i className="bi bi-google me-2"></i>
                Continue with Google
              </Button>
              <p className="mt-3 text-muted small" style={{ color: "#00f6ff" }}>
                Secure authentication powered by zkLogin
              </p>
            </Col>
            <Col md={6} className="text-center">
              <div className="position-relative">
                <div
                  className="position-absolute w-100 h-100"
                  style={{
                    background: "radial-gradient(circle, rgba(0,246,255,0.1) 0%, rgba(0,114,255,0.05) 100%)",
                    filter: "blur(40px)",
                    zIndex: 0
                  }}
                />
                <img
                  src={coverImg}
                  alt="Prediction Markets"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{
                    maxWidth: "480px",
                    position: "relative",
                    zIndex: 1,
                    transform: "perspective(1000px) rotateY(-15deg)",
                    transition: "transform 0.3s ease"
                  }}
                  onMouseOver={(e) => e.target.style.transform = "perspective(1000px) rotateY(0deg)"}
                  onMouseOut={(e) => e.target.style.transform = "perspective(1000px) rotateY(-15deg)"}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <footer className="text-center py-4" style={{ background: "rgba(0,0,0,0.3)" }}>
          <Container>
            <Row className="align-items-center">
              <Col>
                <img 
                  src="/sui.webp" 
                  alt="SUI" 
                  style={{ height: "24px" }}
                  className="me-2"
                />
                <span style={{ color: "#f1efefc7" }}>Powered by Sui Network</span>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }
  return null;
};

Cover.propTypes = {
  name: PropTypes.string,
  coverImg: PropTypes.string.isRequired,
};

Cover.defaultProps = {
  name: "",
};

export default Cover;

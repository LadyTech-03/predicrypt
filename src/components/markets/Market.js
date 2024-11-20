import React, { useState, useEffect } from "react";
import { Card, Button, Col, Form, Modal, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

const Market = ({ market, placeBet, resolveMarket, claimWinnings, userBets }) => {
  const { 
    id, 
    title, 
    description, 
    endTimestamp, 
    yesPools, 
    noPools, 
    resolved, 
    outcome,
    creator 
  } = market;

  const [show, setShow] = useState(false);
  const [prediction, setPrediction] = useState(true);
  const [amount, setAmount] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const totalPool = (yesPools + noPools) / 1_000_000_000;
  const yesPercentage = totalPool ? (yesPools / (yesPools + noPools)) * 100 : 0;
  const noPercentage = 100 - yesPercentage;

  // Calculate time left
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTimestamp - now;
      
      if (distance < 0) {
        setIsEnded(true);
        setTimeLeft("Ended");
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp]);

  return (
    <Col>
      <Card className="h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title>{title}</Card.Title>
          <Card.Text>{description}</Card.Text>
          
          <div className="mt-auto">
            <div className="mb-3">
              <small className="text-muted">Pool Distribution:</small>
              <div className="progress">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${yesPercentage}%` }}
                >
                  Yes ({yesPercentage.toFixed(1)}%)
                </div>
                <div 
                  className="progress-bar bg-danger" 
                  style={{ width: `${noPercentage}%` }}
                >
                  No ({noPercentage.toFixed(1)}%)
                </div>
              </div>
              <small className="text-muted">Total Pool: {totalPool.toFixed(2)} SUI</small>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <Badge bg={isEnded ? "secondary" : "primary"}>
                {timeLeft}
              </Badge>
              {resolved && (
                <Badge bg={outcome ? "success" : "danger"}>
                  Outcome: {outcome ? "Yes" : "No"}
                </Badge>
              )}
            </div>

            {!resolved && !isEnded && (
              <Button
                variant="outline-primary"
                onClick={handleShow}
                className="w-100"
              >
                Place Bet
              </Button>
            )}

            {isEnded && !resolved && creator === AuthService.walletAddress() && (
              <Button
                variant="outline-warning"
                onClick={() => resolveMarket(id)}
                className="w-100"
              >
                Resolve Market
              </Button>
            )}

            {resolved && userBets?.some(bet => 
              bet.marketId === id && bet.prediction === outcome
            ) && (
              <Button
                variant="outline-success"
                onClick={() => claimWinnings(id)}
                className="w-100"
              >
                Claim Winnings
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Place Bet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Prediction</Form.Label>
              <Form.Select
                onChange={(e) => setPrediction(e.target.value === "true")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (SUI)</Form.Label>
              <Form.Control
                type="number"
                min="0.1"
                step="0.1"
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              placeBet(id, prediction, amount);
              handleClose();
            }}
          >
            Place Bet
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

Market.propTypes = {
  market: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    endTimestamp: PropTypes.number.isRequired,
    yesPools: PropTypes.number.isRequired,
    noPools: PropTypes.number.isRequired,
    resolved: PropTypes.bool.isRequired,
    outcome: PropTypes.bool,
    creator: PropTypes.string.isRequired,
  }).isRequired,
  placeBet: PropTypes.func.isRequired,
  resolveMarket: PropTypes.func.isRequired,
  claimWinnings: PropTypes.func.isRequired,
  userBets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    marketId: PropTypes.string.isRequired,
    prediction: PropTypes.bool.isRequired,
    amount: PropTypes.number.isRequired,
  })),
};

export default Market;
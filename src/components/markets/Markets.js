import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";
import CreateMarket from "./CreateMarket";
import Market from "./Market";
import Loader from "../utils/Loader";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { MarketService } from "../../utils/marketService";

const Markets = () => {
  const [markets, setMarkets] = useState([]);
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const marketService = new MarketService();

  // Fetch both markets and user bets
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [marketsData, betsData] = await Promise.all([
        marketService.getMarkets(),
        marketService.getBets()
      ]);
      setMarkets(marketsData);
      setUserBets(betsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast(<NotificationError text="Failed to fetch markets and bets." />);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMarket = async (data) => {
    try {
      setLoading(true);
      await marketService.createMarket(
        data.title,
        data.description,
        data.endDate
      );
      toast(<NotificationSuccess text="Market created successfully." />);
      fetchData(); // Refresh markets list
    } catch (error) {
      console.error("Error creating market:", error);
      toast(<NotificationError text="Failed to create market." />);
    } finally {
      setLoading(false);
    }
  };

  const placeBet = async (marketId, prediction, amount) => {
    try {
      setLoading(true);
      await marketService.placeBet(marketId, prediction, amount);
      toast(<NotificationSuccess text="Bet placed successfully." />);
      fetchData(); // Refresh markets and bets
    } catch (error) {
      console.error("Error placing bet:", error);
      toast(<NotificationError text="Failed to place bet." />);
    } finally {
      setLoading(false);
    }
  };

  const resolveMarket = async (marketId) => {
    try {
      setLoading(true);
      // Show confirmation dialog
      const outcome = window.confirm("Was the outcome Yes? Click OK for Yes, Cancel for No");
      await marketService.resolveMarket(marketId, outcome);
      toast(<NotificationSuccess text="Market resolved successfully." />);
      fetchData(); // Refresh markets
    } catch (error) {
      console.error("Error resolving market:", error);
      toast(<NotificationError text="Failed to resolve market." />);
    } finally {
      setLoading(false);
    }
  };

  const claimWinnings = async (marketId) => {
    try {
      setLoading(true);
      // Find the winning bet for this market
      const winningBet = userBets.find(bet => bet.marketId === marketId);
      if (!winningBet) {
        throw new Error("No winning bet found");
      }
      
      await marketService.claimWinnings(marketId, winningBet.id);
      toast(<NotificationSuccess text="Winnings claimed successfully." />);
      fetchData(); // Refresh markets and bets
    } catch (error) {
      console.error("Error claiming winnings:", error);
      toast(<NotificationError text="Failed to claim winnings." />);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Row className="justify-content-center mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="fs-4 fw-bold mb-0">PrediCrypt</h1>
            <CreateMarket save={createMarket} />
          </div>
        </Col>
      </Row>

      {markets.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {markets.map((market) => (
            <Market
              key={market.id}
              market={market}
              placeBet={placeBet}
              resolveMarket={resolveMarket}
              claimWinnings={claimWinnings}
              userBets={userBets}
            />
          ))}
        </Row>
      ) : (
        <div className="text-center mt-5">
          <p className="text-muted">No prediction markets available.</p>
          <p className="text-muted">Create one to get started!</p>
        </div>
      )}
    </Container>
  );
};

export default Markets;
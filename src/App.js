import React, { useState, useCallback, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import Wallet from "./components/Wallet";
import Cover from "./components/utils/Cover";
import coverImg from "./assets/img/sui-cover.png";
import { Notification } from "./components/utils/Notifications";
import "./App.css";
import { AuthService } from './utils/authService';
import { SuiService } from './utils/suiService';
import Markets from "./components/markets/Markets";


const App = () => {
  const [balance, setBalance] = useState("0");

  let walletAddress;
  const suiService = new SuiService();

  const getBalance = useCallback(async () => {
    try {
      if (AuthService.isAuthenticated()) {
        setBalance(await suiService.getFormattedBalance(AuthService.walletAddress()));
      }
    } catch (error) {
      console.log({ error });
    } finally {
    }
  });

  const logout = async () => {
    sessionStorage.clear();

    window.location.href = '/notes';
  };

  if (AuthService.isAuthenticated()) {
    walletAddress = AuthService.walletAddress();
  }

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      {AuthService.isAuthenticated() ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                address={walletAddress}
                amount={balance}
                symbol="SUI"
                destroy={logout}
              />
            </Nav.Item>
          </Nav>
          <main>
            {/* <Notes /> */}
            <Markets />
          </main>
        </Container>
      ) : (
        <Cover name="PrediCrypt" coverImg={coverImg} />
      )
      }
    </>
  );
};

export default App;
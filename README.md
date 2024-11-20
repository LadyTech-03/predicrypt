# predicrypt: Decentralized Prediction Markets

A decentralized prediction market platform built on the Sui blockchain, allowing users to create markets, place bets, and earn rewards for accurate predictions.

## Disclaimer: Use of Unaudited Code for Educational Purposes Only
This code is provided strictly for educational purposes and has not undergone any formal security audit. 
It may contain errors, vulnerabilities, or other issues that could pose risks to the integrity of your system or data.

By using this code, you acknowledge and agree that:
- No Warranty: The code is provided "as is" without any warranty of any kind, either express or implied. The entire risk as to the quality and performance of the code is with you.
- Educational Use Only: This code is intended solely for educational and learning purposes. It is not intended for use in any mission-critical or production systems.
- No Liability: In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the use or performance of this code.
- Security Risks: The code may not have been tested for security vulnerabilities. It is your responsibility to conduct a thorough security review before using this code in any sensitive or production environment.
- No Support: The authors of this code may not provide any support, assistance, or updates. You are using the code at your own risk and discretion.

## Features

- Create prediction markets with customizable parameters
- Place bets using SUI tokens
- Secure authentication using zkLogin
- Real-time market updates
- Community-driven market resolution
- Automated reward distribution
- User-friendly interface

## Technical Stack

- Frontend: React.js with Bootstrap
- Blockchain: Sui Network
- Authentication: zkLogin
- Smart Contracts: Move Language
- State Management: React Hooks
- Styling: Bootstrap & Custom CSS

### Local Development

1. Clone the repository
```bash
cd predicrypt
```

2. Install dependencies
```bash
npm install
```

3. Run a local Sui network
```bash
git clone --branch devnet https://github.com/MystenLabs/sui.git
cd sui
RUST_LOG="off,sui_node=info" cargo run --bin sui-test-validator
```

4. Get localnet SUI tokens
```bash
curl --location --request POST 'http://127.0.0.1:9123/gas' --header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "<ADDRESS>"
    }
}'
```
Replace `<ADDRESS>` with your active Sui address.

### Deploy Smart Contract

1. Navigate to the contract directory
```bash
cd prediction-market-contract
cd prediction-market
```

2. Build the contract
```bash
sui move build
```

3. Deploy to the network
```bash
sui client publish --gas-budget 100000000
```

4. Update the `.env` file with your contract address
```env
REACT_APP_PROVER_URL="https://prover-dev.mystenlabs.com/v1"
REACT_APP_REDIRECT_URL="http://localhost:8080"
REACT_APP_OPENID_PROVIDER_URL="https://accounts.google.com/.well-known/openid-configuration"
REACT_APP_FULLNODE_URL="http://127.0.0.1:9000"
REACT_APP_CLIENT_ID="<CLIENT_ID>" // replace <CLIENT_ID> with the client ID you copied in the previous section from the Google Console
REACT_APP_PACKAGE_ID=<your_package_id> //This is the contract address. The contract address is used to interact with the predicrypt contract (you'll get this after building and deploying the contract).
```

### Run the Application

1. Start the development server
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── markets/          # Market-related components
│   │   ├── utils/            # Utility components
│   │   └── Wallet.js         # Wallet component
│   ├── utils/
│   │   ├── authService.ts    # Authentication service
│   │   ├── marketService.ts  # Market interaction service
│   │   └── suiService.ts     # Sui blockchain service
│   └── App.js                # Main application component
├── public/
└── prediction-market-contract/
    └── prediction-market/
        └── sources/
            └── prediction_market.move  # Smart contract
```

## Authentication Flow

The application uses zkLogin for secure authentication. The flow is handled by `authService.ts` and includes:
1. Google OAuth authentication
2. zkLogin proof generation
3. Secure wallet creation
4. Transaction signing

More details about the zkLogin flow can be found here: https://docs.sui.io/concepts/cryptography/zklogin

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


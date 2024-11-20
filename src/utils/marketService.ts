import { TransactionBlock } from '@mysten/sui.js/transactions';
import { PACKAGE_ID, SUI_CLIENT } from "./suiClient";
import { AuthService } from "./authService";

export class MarketService {
  async createMarket(title: string, description: string, endDate: string) {
    const txb = new TransactionBlock();
    
    // Convert endDate to Unix timestamp (milliseconds)
    const endTimestamp = new Date(endDate).getTime();
    
    // Get the Clock object for timestamp validation
    const [clock] = txb.moveCall({
      target: '0x2::clock::clock',
    });

    const txData = {
      target: `${PACKAGE_ID}::prediction_market::create_market`,
      arguments: [
        txb.pure.string(title),
        txb.pure.string(description),
        txb.pure.u64(endTimestamp),
        clock
      ]
    };
    return this.makeMoveCall(txData, txb);
  }

  async placeBet(marketId: string, prediction: boolean, amount: number) {
    const txb = new TransactionBlock();
    
    // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
    const amountMist = Math.floor(amount * 1_000_000_000);
    
    // Create coin for bet
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amountMist)]);
    
    // Get the Clock object
    const [clock] = txb.moveCall({
      target: '0x2::clock::clock',
    });

    const txData = {
      target: `${PACKAGE_ID}::prediction_market::place_bet`,
      arguments: [
        txb.object(marketId),
        txb.pure.bool(prediction),
        coin,
        clock
      ]
    };
    return this.makeMoveCall(txData, txb);
  }

  async resolveMarket(marketId: string, outcome: boolean) {
    const txb = new TransactionBlock();
    
    // Get the Clock object
    const [clock] = txb.moveCall({
      target: '0x2::clock::clock',
    });

    const txData = {
      target: `${PACKAGE_ID}::prediction_market::resolve_market`,
      arguments: [
        txb.object(marketId),
        txb.pure.bool(outcome),
        clock
      ]
    };
    return this.makeMoveCall(txData, txb);
  }

  async claimWinnings(marketId: string, betId: string) {
    const txb = new TransactionBlock();
    
    const txData = {
      target: `${PACKAGE_ID}::prediction_market::claim_winnings`,
      arguments: [
        txb.object(marketId),
        txb.object(betId)
      ]
    };
    return this.makeMoveCall(txData, txb);
  }

  async getMarkets() {
    try {
      const markets = await SUI_CLIENT.getOwnedObjects({
        owner: AuthService.walletAddress(),
        filter: {
          StructType: `${PACKAGE_ID}::prediction_market::Market`
        },
        options: {
          showContent: true,
          showType: true,
        }
      });

      return markets.data.map(market => {
        const fields = (market.data?.content as { fields: any })?.fields || {};
        return {
          id: market.data?.objectId,
          title: fields.title,
          description: fields.description,
          creator: fields.creator,
          endTimestamp: Number(fields.end_timestamp),
          yesPools: Number(fields.yes_pool),
          noPools: Number(fields.no_pool),
          resolved: fields.resolved,
          outcome: fields.outcome
        };
      });
    } catch (error) {
      console.error("Error fetching markets:", error);
      throw error;
    }
  }

  async getBets() {
    try {
      const bets = await SUI_CLIENT.getOwnedObjects({
        owner: AuthService.walletAddress(),
        filter: {
          StructType: `${PACKAGE_ID}::prediction_market::Bet`
        },
        options: {
          showContent: true,
          showType: true,
        }
      });

      return bets.data.map(bet => {
        const fields = (bet.data?.content as { fields: any })?.fields || {};
        return {
          id: bet.data?.objectId,
          marketId: fields.market_id,
          amount: Number(fields.amount),
          prediction: fields.prediction
        };
      });
    } catch (error) {
      console.error("Error fetching bets:", error);
      throw error;
    }
  }

  private async makeMoveCall(txData: any, txb: TransactionBlock) {
    const keypair = AuthService.getEd25519Keypair();
    const sender = AuthService.walletAddress();
    txb.setSender(sender);
    txb.moveCall(txData);
    const { bytes, signature: userSignature } = await txb.sign({
      client: SUI_CLIENT,
      signer: keypair,
    });
    const zkLoginSignature = await AuthService.generateZkLoginSignature(userSignature);
    return SUI_CLIENT.executeTransactionBlock({
      transactionBlock: bytes,
      signature: zkLoginSignature,
    });
  }
}
module prediction_market::prediction_market {
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};

    // Errors
    const EInvalidBetAmount: u64 = 0;
    const EMarketEnded: u64 = 1;
    const EMarketNotEnded: u64 = 2;
    const EUnauthorized: u64 = 3;

    // Represents a prediction market
    struct Market has key, store {
        id: UID,
        title: String,
        description: String,
        creator: address,
        end_timestamp: u64,
        yes_pool: Balance<SUI>,
        no_pool: Balance<SUI>,
        resolved: bool,
        outcome: bool
    }

    // Represents a bet placed by a user
    struct Bet has key, store {
        id: UID,
        market_id: ID,
        user: address,
        amount: u64,
        prediction: bool
    }

    // === Public Functions ===

    public fun create_market(
        title: String,
        description: String,
        end_timestamp: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Ensure end timestamp is in the future
        assert!(clock::timestamp_ms(clock) < end_timestamp, EMarketEnded);

        let market = Market {
            id: object::new(ctx),
            title,
            description,
            creator: tx_context::sender(ctx),
            end_timestamp,
            yes_pool: balance::zero(),
            no_pool: balance::zero(),
            resolved: false,
            outcome: false
        };

        transfer::share_object(market);
    }

    public fun place_bet(
        market: &mut Market,
        prediction: bool,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Ensure market hasn't ended
        assert!(clock::timestamp_ms(clock) < market.end_timestamp, EMarketEnded);
        
        let amount = coin::value(&payment);
        assert!(amount > 0, EInvalidBetAmount);

        // Create bet record
        let bet = Bet {
            id: object::new(ctx),
            market_id: object::id(market),
            user: tx_context::sender(ctx),
            amount,
            prediction
        };

        // Add funds to appropriate pool
        if (prediction) {
            balance::join(&mut market.yes_pool, coin::into_balance(payment));
        } else {
            balance::join(&mut market.no_pool, coin::into_balance(payment));
        };

        transfer::transfer(bet, tx_context::sender(ctx));
    }

    public fun resolve_market(
        market: &mut Market,
        outcome: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Ensure market has ended
        assert!(clock::timestamp_ms(clock) >= market.end_timestamp, EMarketNotEnded);
        
        // Only creator can resolve
        assert!(tx_context::sender(ctx) == market.creator, EUnauthorized);
        
        // Ensure market hasn't been resolved yet
        assert!(!market.resolved, EMarketEnded);

        market.resolved = true;
        market.outcome = outcome;
    }

    public fun claim_winnings(
        market: &mut Market,
        bet: Bet,
        ctx: &mut TxContext
    ): Coin<SUI> {
        // Ensure market is resolved
        assert!(market.resolved, EMarketNotEnded);
        
        // Ensure bet belongs to this market
        assert!(bet.market_id == object::id(market), EUnauthorized);
        
        // Ensure bet belongs to sender
        assert!(bet.user == tx_context::sender(ctx), EUnauthorized);
        
        // Ensure bet predicted correct outcome
        assert!(bet.prediction == market.outcome, EUnauthorized);

        let total_pool = if (market.outcome) {
            balance::value(&market.yes_pool)
        } else {
            balance::value(&market.no_pool)
        };

        let winning_pool = if (market.outcome) {
            &mut market.yes_pool
        } else {
            &mut market.no_pool
        };

        // Calculate winnings proportional to bet amount
        let winnings = (bet.amount * total_pool) / balance::value(winning_pool);
        
        // Transfer winnings
        let coins = coin::take(winning_pool, winnings, ctx);
        
        // Clean up bet object
        let Bet { id, market_id: _, user: _, amount: _, prediction: _ } = bet;
        object::delete(id);

        coins
    }

    // === View Functions ===

    public fun get_pools(market: &Market): (u64, u64) {
        (balance::value(&market.yes_pool), balance::value(&market.no_pool))
    }

    public fun is_resolved(market: &Market): bool {
        market.resolved
    }

    public fun get_outcome(market: &Market): bool {
        assert!(market.resolved, EMarketNotEnded);
        market.outcome
    }
}
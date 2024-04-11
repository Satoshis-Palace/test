
export type GetActiveGameQuery = {
	get_active_game: {
		player: string;  // Assuming Addr can be represented as a string
	};
};

export type GetMaxBetMsg = {
	get_max_bet: {};
};

// Combined Type for all QueryMsg variants
export type QueryMsg =
	| GetActiveGameQuery
	| GetMaxBetMsg;

export interface BlackJackResponse {
	game: BlackJackGame;
}

export interface BlackJackGame {
	dealer_cards: Card[];
	player_cards: Card[];
	game_state: number;      // Assuming u8 can be represented as a number
	bet_amount: string;      // Assuming Uint128 can be represented as a string
}
export interface Card {
	number: number;          // Assuming u8 can be represented as a number
}

export interface MaxBetResponse {
	max_bet: string;
}

export type QueryAnswer =
	| BlackJackResponse
	| MaxBetResponse
	;

////////////// Helpers ///////////////

// Mapping of card numbers to their face values
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Function to get the card value from the card number
export const getCardValue = (card: Card): string => {
	return cardValues[Math.floor(card.number / 4)];
};
// Function to calculate the blackjack score for a hand
export const calculateHandScore = (cards: Card[]): number => {
	let score = 0;
	let aceCount = 0;

	cards.forEach((card) => {
		const value = getCardValue(card);
		if (value === 'A') {
			aceCount += 1;
			score += 11;
		} else if (['J', 'Q', 'K'].includes(value)) {
			score += 10;
		} else {
			score += parseInt(value);
		}
	});

	while (score > 21 && aceCount > 0) {
		score -= 10;
		aceCount -= 1;
	}

	return score;
};

export const PLAYER_TURN: number = 0;
export const PLAYER_BUST: number = 1;
export const PLAYER_WIN: number = 2;
export const DEALER_WIN: number = 3;

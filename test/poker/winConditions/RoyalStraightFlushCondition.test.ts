import { describe, expect, test } from "@jest/globals";
import { Player } from "../../../src/poker/Player";
import Wallet from "../../../src/poker/Wallet";
import Card from "../../../src/poker/Card";
import { Suit } from "../../../src/poker/Suit";
import { CardSpecialNumber } from "../../../src/poker/CardSpecialNumber";
import RoyalStraightFlushCondition from "../../../src/poker/winConditions/RoyalStraightFlushCondition";

describe('RoyalStraightFlushCondition', () => {
    test.each([
        [
            [new Card(Suit.CLUBS, CardSpecialNumber.J), new Card(Suit.CLUBS, CardSpecialNumber.Q)],
            [
                new Card(Suit.CLUBS, 1),
                new Card(Suit.CLUBS, CardSpecialNumber.K),
                new Card(Suit.CLUBS, 10),
                new Card(Suit.HEARTS, 2),
                new Card(Suit.DIAMONDS, 3)
            ]
        ],
        [
            [new Card(Suit.CLUBS, CardSpecialNumber.J), new Card(Suit.HEARTS, CardSpecialNumber.Q)],
            [
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.CLUBS, CardSpecialNumber.K),
                new Card(Suit.CLUBS, 10),
                new Card(Suit.CLUBS, CardSpecialNumber.Q),
                new Card(Suit.CLUBS, 1)
            ]
        ]
    ])('hand and table with royal straight flush', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200))
        p.addToHand(...hand);
        const condition = new RoyalStraightFlushCondition();
        const points = condition.calculatePoints(p, table);
        expect(condition.order).toBe(0);
        expect(points).toStrictEqual(-1);
    });
    
    test.each([
        [
            [new Card(Suit.SPADES, CardSpecialNumber.J), new Card(Suit.DIAMONDS, CardSpecialNumber.Q)],
            [
                new Card(Suit.CLUBS, 1),
                new Card(Suit.SPADES, CardSpecialNumber.K),
                new Card(Suit.CLUBS, 10),
                new Card(Suit.HEARTS, 2),
                new Card(Suit.DIAMONDS, 3)
            ]
        ],
        [
            [new Card(Suit.HEARTS, CardSpecialNumber.J), new Card(Suit.HEARTS, CardSpecialNumber.Q)],
            [
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.SPADES, CardSpecialNumber.K),
                new Card(Suit.HEARTS, 10),
                new Card(Suit.DIAMONDS, CardSpecialNumber.Q),
                new Card(Suit.SPADES, 1)
            ]
        ]
    ])('hand and table without royal straight flush', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200))
        p.addToHand(...hand);
        const condition = new RoyalStraightFlushCondition();
        const points = condition.calculatePoints(p, table);
        expect(condition.order).toBe(0);
        expect(points).toStrictEqual(0);
    });
});
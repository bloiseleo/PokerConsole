import { describe, expect, test, beforeEach } from "@jest/globals";
import { Player } from "../../../src/poker/Player";
import Wallet from "../../../src/poker/Wallet";
import { Suit } from "../../../src/poker/Suit";
import Card from "../../../src/poker/Card";
import FullHouseCondition from "../../../src/poker/winConditions/FullHouseCondition";

describe('FullHouseCondition', () => {
    let condition: FullHouseCondition;
    beforeEach(() => {
        condition = new FullHouseCondition();
    });
    test.each([
        [
            [new Card(Suit.CLUBS, 2), new Card(Suit.SPADES, 2)],
            [
                new Card(Suit.HEARTS, 1),
                new Card(Suit.SPADES, 1),
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.SPADES, 4),
            ]
        ],
        [
            [new Card(Suit.CLUBS, 2), new Card(Suit.SPADES, 3)],
            [
                new Card(Suit.HEARTS, 2),
                new Card(Suit.SPADES, 2),
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.SPADES, 4),
            ]
        ],
        [
            [new Card(Suit.CLUBS, 3), new Card(Suit.SPADES, 3)],
            [
                new Card(Suit.HEARTS, 3),
                new Card(Suit.SPADES, 1),
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.SPADES, 4),
            ]
        ]
    ])('hand and table contains a full house', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200));
        p.addToHand(...hand);
        expect(condition.order).toStrictEqual(3);
        const points = condition.calculatePoints(p, table);
        expect(points).toStrictEqual(3);
    });
    test.each([
        [
            [new Card(Suit.CLUBS, 10), new Card(Suit.DIAMONDS, 5)],
            [
                new Card(Suit.HEARTS, 3),
                new Card(Suit.SPADES, 1),
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.SPADES, 4),
            ]
        ],
        [
            [new Card(Suit.CLUBS, 5), new Card(Suit.DIAMONDS, 5)],
            [
                new Card(Suit.HEARTS, 3),
                new Card(Suit.SPADES, 1),
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.SPADES, 4),
            ]
        ]
    ])('hand and table without a full house', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200));
        p.addToHand(...hand);
        expect(condition.order).toStrictEqual(3);
        const points = condition.calculatePoints(p, table);
        expect(points).toStrictEqual(0);
    });
});
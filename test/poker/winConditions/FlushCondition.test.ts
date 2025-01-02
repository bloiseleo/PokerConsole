import { describe, test, expect, beforeEach } from "@jest/globals";
import Card from "../../../src/poker/Card";
import Wallet from "../../../src/poker/Wallet";
import { Player } from "../../../src/poker/Player";
import FlushCondition from "../../../src/poker/winConditions/FlushCondition";
import { Suit } from "../../../src/poker/Suit";
import { CardSpecialNumber } from "../../../src/poker/CardSpecialNumber";

describe('FlushCondition', () => {
    let condition: FlushCondition;
    beforeEach(() => {
        condition = new FlushCondition();
    })
    test.each([
        [
            [new Card(Suit.CLUBS, 1), new Card(Suit.CLUBS, 2)],
            [
                new Card(Suit.CLUBS, 3),
                new Card(Suit.CLUBS, 4),
                new Card(Suit.CLUBS, 5),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.DIAMONDS, 2),
            ]
        ],
        [
           [new Card(Suit.DIAMONDS, CardSpecialNumber.J), new Card(Suit.DIAMONDS, 2)],
            [
                new Card(Suit.DIAMONDS, CardSpecialNumber.K),
                new Card(Suit.DIAMONDS, 5),
                new Card(Suit.DIAMONDS, 10),
                new Card(Suit.HEARTS, 3),
                new Card(Suit.HEARTS, 2),
            ]
        ]
    ])('hand and table with flush', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200));
        p.addToHand(...hand);
        expect(condition.order).toStrictEqual(4);
        const points = condition.calculatePoints(p, table);
        expect(points).toStrictEqual(4);
    });
    test.each([
        [
            [new Card(Suit.CLUBS, 1), new Card(Suit.DIAMONDS, 2)],
            [
                new Card(Suit.SPADES, 3),
                new Card(Suit.HEARTS, 4),
                new Card(Suit.CLUBS, 5),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.DIAMONDS, 2),
            ]
        ],
        [
           [new Card(Suit.DIAMONDS, CardSpecialNumber.J), new Card(Suit.HEARTS, 2)],
            [
                new Card(Suit.SPADES, CardSpecialNumber.K),
                new Card(Suit.CLUBS, 5),
                new Card(Suit.DIAMONDS, 10),
                new Card(Suit.HEARTS, 3),
                new Card(Suit.HEARTS, 2),
            ]
        ]
    ])('hand and table without flush', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200));
        p.addToHand(...hand);
        expect(condition.order).toStrictEqual(4);
        const points = condition.calculatePoints(p, table);
        expect(points).toStrictEqual(0);
    });
});
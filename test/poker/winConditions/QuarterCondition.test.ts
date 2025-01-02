import { describe, expect, test } from "@jest/globals";
import { Player } from "../../../src/poker/Player";
import Wallet from "../../../src/poker/Wallet";
import Card from "../../../src/poker/Card";
import { Suit } from "../../../src/poker/Suit";
import QuarterCondition from "../../../src/poker/winConditions/QuarterCondition";

describe('QuarterCondition', () => {
    test.each([
        [
            [new Card(Suit.CLUBS, 1), new Card(Suit.DIAMONDS, 1)],
            [
                new Card(Suit.HEARTS, 1),
                new Card(Suit.SPADES, 1),
                new Card(Suit.HEARTS, 2),
                new Card(Suit.DIAMONDS, 3),
                new Card(Suit.CLUBS, 4),
            ]
        ],
        [
            [new Card(Suit.CLUBS, 2), new Card(Suit.DIAMONDS, 1)],
            [
                new Card(Suit.HEARTS, 1),
                new Card(Suit.SPADES, 1),
                new Card(Suit.HEARTS, 2),
                new Card(Suit.DIAMONDS, 2),
                new Card(Suit.SPADES, 2),
            ]
        ]
    ])('hand and table with a quarter', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200));
        p.addToHand(...hand);
        const condition = new QuarterCondition();
        expect(condition.order).toStrictEqual(2);
        const points = condition.calculatePoints(p, table);
        expect(points).toStrictEqual(2);
    });
    test('hand and without table without a quarter', () => {
        const p = new Player(1, 'Mock Player', new Wallet(200));
        p.addToHand(new Card(Suit.CLUBS, 2), new Card(Suit.CLUBS, 3));
        const table = [
            new Card(Suit.HEARTS, 1),
            new Card(Suit.SPADES, 1),
            new Card(Suit.HEARTS, 4),
            new Card(Suit.DIAMONDS, 3),
            new Card(Suit.SPADES, 2),
        ];
        const condition = new QuarterCondition();
        expect(condition.order).toStrictEqual(2);
        const points = condition.calculatePoints(p, table);
        expect(points).toStrictEqual(0);
    });
});
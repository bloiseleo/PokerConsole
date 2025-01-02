import {describe, expect, test} from '@jest/globals';
import Card from "../../../src/poker/Card";
import { Suit } from "../../../src/poker/Suit";
import StraightFlushCondition from "../../../src/poker/winConditions/StraightFlushCondition";
import { Player } from '../../../src/poker/Player';
import Wallet from '../../../src/poker/Wallet';

describe('StraightFlushCondition', () => {
    test.each([
        [
            [new Card(Suit.CLUBS, 5), new Card(Suit.CLUBS, 6)],
            [        
                new Card(Suit.CLUBS, 7),
                new Card(Suit.CLUBS, 8),
                new Card(Suit.CLUBS, 9),
                new Card(Suit.HEARTS, 9),
                new Card(Suit.DIAMONDS, 9),
            ]
        ],
        [
            [new Card(Suit.CLUBS, 5), new Card(Suit.HEARTS, 6)],
            [        
                new Card(Suit.CLUBS, 6),
                new Card(Suit.CLUBS, 9),
                new Card(Suit.CLUBS, 7),
                new Card(Suit.DIAMONDS, 1),
                new Card(Suit.CLUBS, 8),
            ]
        ]
    ])('hand and table with straight flush', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200))
        p.addToHand(...hand);
        const condition = new StraightFlushCondition();
        const points = condition.calculatePoints(p, table);
        expect(condition.order).toBe(1);
        expect(points).toStrictEqual(1);
    })
    test.each(
        [
            [
                [new Card(Suit.CLUBS, 5), new Card(Suit.HEARTS, 6)],
                [        
                    new Card(Suit.CLUBS, 7),
                    new Card(Suit.CLUBS, 8),
                    new Card(Suit.CLUBS, 9),
                    new Card(Suit.HEARTS, 9),
                    new Card(Suit.DIAMONDS, 9),
                ]
            ],
            [
                [new Card(Suit.DIAMONDS, 5), new Card(Suit.HEARTS, 6)],
                [        
                    new Card(Suit.CLUBS, 6),
                    new Card(Suit.CLUBS, 9),
                    new Card(Suit.CLUBS, 7),
                    new Card(Suit.DIAMONDS, 1),
                    new Card(Suit.CLUBS, 8),
                ]
            ]
        ]
    )('hand and table without a straight flush', (hand: Card[], table: Card[]) => {
        const p = new Player(1, 'Mock Player', new Wallet(200))
        p.addToHand(...hand);
        const condition = new StraightFlushCondition();
        const points = condition.calculatePoints(p, table);
        expect(condition.order).toBe(1);
        expect(points).toStrictEqual(0);
    });
});
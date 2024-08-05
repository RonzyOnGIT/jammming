import { convertTimeIntoMiliseconds } from './utils';
import { describe, it, expect } from 'vitest';

describe('time conversion', () => {
    it('should return 43200000 when midnight (hours is 0)', () => {
        const date = new Date(2024, 7, 5, 0, 0, 0, 0);

        const expectedResult = 43200000;

        expect(convertTimeIntoMiliseconds(date)).toBe(expectedResult);
    })
    it ('should return 12630000 even if we pass in miliseconds', () => {
        const date = new Date(2024, 7, 5, 3, 30, 30, 50);

        const expectedResult = 12630000;

        expect(convertTimeIntoMiliseconds(date)).toBe(expectedResult);
    })
})
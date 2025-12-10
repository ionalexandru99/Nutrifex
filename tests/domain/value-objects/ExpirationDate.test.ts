import { ExpirationType } from '@domain/enums/ExpirationType';
import { ExpirationDate } from '@domain/value-objects/ExpirationDate';

import { daysFromNow, daysAgo } from '../../helpers';

describe('ExpirationDate', () => {
  describe('Factory Methods', () => {
    describe('create()', () => {
      it('should create a valid expiration date with BEST_BEFORE type', () => {
        const futureDate = daysFromNow(7);
        const expiration = ExpirationDate.create({
          date: futureDate,
          type: ExpirationType.BEST_BEFORE,
        });

        expect(expiration.date.getTime()).toBe(futureDate.getTime());
        expect(expiration.type).toBe(ExpirationType.BEST_BEFORE);
      });

      it('should create a valid expiration date with USE_BY type', () => {
        const futureDate = daysFromNow(7);
        const expiration = ExpirationDate.create({
          date: futureDate,
          type: ExpirationType.USE_BY,
        });

        expect(expiration.date.getTime()).toBe(futureDate.getTime());
        expect(expiration.type).toBe(ExpirationType.USE_BY);
      });

      it('should throw on invalid date', () => {
        expect(() =>
          ExpirationDate.create({
            date: new Date('invalid'),
            type: ExpirationType.BEST_BEFORE,
          }),
        ).toThrow('Invalid expiration date');
      });

      it('should create a copy of the date (immutability)', () => {
        const originalDate = daysFromNow(7);
        const expiration = ExpirationDate.create({
          date: originalDate,
          type: ExpirationType.BEST_BEFORE,
        });

        // Mutate original date
        originalDate.setDate(originalDate.getDate() + 100);

        // Expiration should be unaffected
        expect(expiration.date.getTime()).not.toBe(originalDate.getTime());
      });
    });

    describe('bestBefore()', () => {
      it('should create a BEST_BEFORE expiration date', () => {
        const futureDate = daysFromNow(14);
        const expiration = ExpirationDate.bestBefore(futureDate);

        expect(expiration.type).toBe(ExpirationType.BEST_BEFORE);
        expect(expiration.date.getTime()).toBe(futureDate.getTime());
      });
    });

    describe('useBy()', () => {
      it('should create a USE_BY expiration date', () => {
        const futureDate = daysFromNow(7);
        const expiration = ExpirationDate.useBy(futureDate);

        expect(expiration.type).toBe(ExpirationType.USE_BY);
        expect(expiration.date.getTime()).toBe(futureDate.getTime());
      });
    });

    describe('fromPersistence()', () => {
      it('should parse ISO string date correctly', () => {
        const dateString = '2025-12-31T00:00:00.000Z';
        const expiration = ExpirationDate.fromPersistence({
          date: dateString,
          type: ExpirationType.BEST_BEFORE,
        });

        expect(expiration.date.toISOString()).toBe(dateString);
        expect(expiration.type).toBe(ExpirationType.BEST_BEFORE);
      });

      it('should parse Date object correctly', () => {
        const date = daysFromNow(7);
        const expiration = ExpirationDate.fromPersistence({
          date: date,
          type: ExpirationType.USE_BY,
        });

        expect(expiration.date.getTime()).toBe(date.getTime());
        expect(expiration.type).toBe(ExpirationType.USE_BY);
      });
    });
  });

  describe('Getters', () => {
    it('should return a new Date instance (not reference)', () => {
      const originalDate = daysFromNow(7);
      const expiration = ExpirationDate.create({
        date: originalDate,
        type: ExpirationType.BEST_BEFORE,
      });

      const date1 = expiration.date;
      const date2 = expiration.date;

      expect(date1).not.toBe(date2);
      expect(date1.getTime()).toBe(date2.getTime());
    });

    it('should return correct type', () => {
      const expiration = ExpirationDate.useBy(daysFromNow(7));

      expect(expiration.type).toBe(ExpirationType.USE_BY);
    });
  });

  describe('Methods', () => {
    describe('isExpired()', () => {
      it('should return false for future date', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(7));

        expect(expiration.isExpired()).toBe(false);
      });

      it('should return true for past date', () => {
        const expiration = ExpirationDate.bestBefore(daysAgo(1));

        expect(expiration.isExpired()).toBe(true);
      });

      it('should use custom reference date correctly', () => {
        const expirationDate = daysFromNow(5);
        const expiration = ExpirationDate.bestBefore(expirationDate);

        // Using a reference date before expiration
        const beforeExpiration = daysFromNow(3);
        expect(expiration.isExpired(beforeExpiration)).toBe(false);

        // Using a reference date after expiration
        const afterExpiration = daysFromNow(10);
        expect(expiration.isExpired(afterExpiration)).toBe(true);
      });
    });

    describe('daysUntilExpiration()', () => {
      it('should return positive days for future date', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(7));
        const days = expiration.daysUntilExpiration();

        expect(days).toBeGreaterThanOrEqual(6);
        expect(days).toBeLessThanOrEqual(8);
      });

      it('should return negative days for past date', () => {
        const expiration = ExpirationDate.bestBefore(daysAgo(3));
        const days = expiration.daysUntilExpiration();

        expect(days).toBeLessThanOrEqual(-2);
        expect(days).toBeGreaterThanOrEqual(-4);
      });

      it('should use custom reference date correctly', () => {
        const expirationDate = new Date('2025-12-31T12:00:00.000Z');
        const expiration = ExpirationDate.bestBefore(expirationDate);

        const referenceDate = new Date('2025-12-25T12:00:00.000Z');
        const days = expiration.daysUntilExpiration(referenceDate);

        expect(days).toBe(6);
      });
    });

    describe('isExpiringSoon()', () => {
      it('should return true within default threshold (3 days)', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(2));

        expect(expiration.isExpiringSoon()).toBe(true);
      });

      it('should return true at threshold boundary', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(3));

        expect(expiration.isExpiringSoon()).toBe(true);
      });

      it('should return false beyond threshold', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(10));

        expect(expiration.isExpiringSoon()).toBe(false);
      });

      it('should return false for already expired', () => {
        const expiration = ExpirationDate.bestBefore(daysAgo(1));

        expect(expiration.isExpiringSoon()).toBe(false);
      });

      it('should use custom threshold correctly', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(5));

        expect(expiration.isExpiringSoon(3)).toBe(false);
        expect(expiration.isExpiringSoon(7)).toBe(true);
      });

      it('should use custom reference date correctly', () => {
        const expirationDate = new Date('2025-12-31T12:00:00.000Z');
        const expiration = ExpirationDate.bestBefore(expirationDate);

        const referenceDate = new Date('2025-12-29T12:00:00.000Z');
        expect(expiration.isExpiringSoon(3, referenceDate)).toBe(true);

        const earlyReference = new Date('2025-12-20T12:00:00.000Z');
        expect(expiration.isExpiringSoon(3, earlyReference)).toBe(false);
      });
    });

    describe('isSafetyCritical()', () => {
      it('should return true for USE_BY type', () => {
        const expiration = ExpirationDate.useBy(daysFromNow(7));

        expect(expiration.isSafetyCritical()).toBe(true);
      });

      it('should return false for BEST_BEFORE type', () => {
        const expiration = ExpirationDate.bestBefore(daysFromNow(7));

        expect(expiration.isSafetyCritical()).toBe(false);
      });
    });

    describe('equals()', () => {
      it('should return true for identical instances', () => {
        const date = new Date('2025-12-31T00:00:00.000Z');
        const exp1 = ExpirationDate.create({ date, type: ExpirationType.BEST_BEFORE });
        const exp2 = ExpirationDate.create({ date, type: ExpirationType.BEST_BEFORE });

        expect(exp1.equals(exp2)).toBe(true);
      });

      it('should return false for different dates', () => {
        const exp1 = ExpirationDate.bestBefore(daysFromNow(5));
        const exp2 = ExpirationDate.bestBefore(daysFromNow(10));

        expect(exp1.equals(exp2)).toBe(false);
      });

      it('should return false for different types', () => {
        const date = new Date('2025-12-31T00:00:00.000Z');
        const exp1 = ExpirationDate.bestBefore(date);
        const exp2 = ExpirationDate.useBy(date);

        expect(exp1.equals(exp2)).toBe(false);
      });
    });

    describe('toObject()', () => {
      it('should return ISO string and type', () => {
        const date = new Date('2025-12-31T00:00:00.000Z');
        const expiration = ExpirationDate.create({
          date,
          type: ExpirationType.USE_BY,
        });

        const obj = expiration.toObject();

        expect(obj.date).toBe('2025-12-31T00:00:00.000Z');
        expect(obj.type).toBe(ExpirationType.USE_BY);
      });
    });
  });
});

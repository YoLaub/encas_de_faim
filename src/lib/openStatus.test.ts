import { describe, expect, it } from 'vitest';
import { getOpenStatus } from './openStatus';

// Paris is UTC+1 in winter (CET) and UTC+2 in summer (CEST).
// 2026-11-24 is a Tuesday, 2026-07-14 is a Tuesday.
const winter = (day: number, time: string) => new Date(`2026-11-${day}T${time}:00+01:00`);
const summer = (day: number, time: string) => new Date(`2026-07-${day}T${time}:00+02:00`);

describe('getOpenStatus', () => {
  it('is open during the lunch service and says when it closes', () => {
    const status = getOpenStatus(winter(24, '12:00'));
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe("Ouvert jusqu'à 14h");
  });

  it('is closed between lunch and dinner and reopens the same day', () => {
    const status = getOpenStatus(winter(24, '15:00'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe("Fermé, rouvre aujourd'hui à 18h");
  });

  it('treats the closing minute as closed', () => {
    const status = getOpenStatus(winter(24, '22:00'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe('Fermé, rouvre demain à 11h30');
  });

  it('is open on Friday until 22h30', () => {
    const status = getOpenStatus(winter(27, '22:15'));
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe("Ouvert jusqu'à 22h30");
  });

  it('has no lunch service on Saturday', () => {
    const status = getOpenStatus(winter(28, '12:00'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe("Fermé, rouvre aujourd'hui à 18h");
  });

  it('rolls over to Monday after Sunday dinner', () => {
    const status = getOpenStatus(winter(29, '22:30'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe('Fermé, rouvre demain à 11h30');
  });

  it('is closed just after midnight and reopens the same day', () => {
    const status = getOpenStatus(winter(24, '00:30'));
    expect(status.isOpen).toBe(false);
    expect(status.label).toBe("Fermé, rouvre aujourd'hui à 11h30");
  });

  it('names the weekday when the next opening is more than one day away', () => {
    // Saturday 2026-11-28 22:45 -> next opening is Sunday 18h (tomorrow)
    expect(getOpenStatus(winter(28, '22:45')).label).toBe('Fermé, rouvre demain à 18h');
  });

  it('reads the Paris wall clock in summer time', () => {
    const status = getOpenStatus(summer(14, '12:00'));
    expect(status.isOpen).toBe(true);
    expect(status.label).toBe("Ouvert jusqu'à 14h");
  });

  it('does not depend on the timezone of the machine running it', () => {
    // 11:00Z on 2026-11-24 is 12:00 in Paris.
    expect(getOpenStatus(new Date('2026-11-24T11:00:00Z')).isOpen).toBe(true);
    // 17:30Z is 18:30 in Paris, dinner service.
    expect(getOpenStatus(new Date('2026-11-24T17:30:00Z')).isOpen).toBe(true);
    // 14:30Z is 15:30 in Paris, between services.
    expect(getOpenStatus(new Date('2026-11-24T14:30:00Z')).isOpen).toBe(false);
  });
});

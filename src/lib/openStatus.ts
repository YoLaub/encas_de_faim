import { openingHoursSpecification } from './business';

type Spec = {
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
};

export type OpenStatus = {
  isOpen: boolean;
  label: string;
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const parisClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Paris',
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return minutes === '00' ? `${Number(hours)}h` : `${Number(hours)}h${minutes}`;
}

function rangesForDay(day: string, specs: Spec[]) {
  return specs
    .filter((spec) => [spec.dayOfWeek].flat().includes(day))
    .map((spec) => ({ opens: spec.opens, closes: spec.closes }))
    .sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens));
}

function dayLabel(offset: number, dayIndex: number): string {
  if (offset === 0) return "aujourd'hui";
  if (offset === 1) return 'demain';
  return DAYS_FR[dayIndex];
}

export function getOpenStatus(now: Date, specs: Spec[] = openingHoursSpecification): OpenStatus {
  const parts = parisClock.formatToParts(now);
  const weekday = parts.find((part) => part.type === 'weekday')!.value;
  const hour = Number(parts.find((part) => part.type === 'hour')!.value);
  const minute = Number(parts.find((part) => part.type === 'minute')!.value);
  const minutesNow = hour * 60 + minute;
  const todayIndex = DAYS.indexOf(weekday);

  const current = rangesForDay(weekday, specs).find(
    (range) => toMinutes(range.opens) <= minutesNow && minutesNow < toMinutes(range.closes),
  );
  if (current) {
    return { isOpen: true, label: `Ouvert jusqu'à ${formatTime(current.closes)}` };
  }

  for (let offset = 0; offset <= 7; offset += 1) {
    const dayIndex = (todayIndex + offset) % 7;
    const next = rangesForDay(DAYS[dayIndex], specs).find(
      (range) => offset > 0 || toMinutes(range.opens) > minutesNow,
    );
    if (next) {
      return {
        isOpen: false,
        label: `Fermé, rouvre ${dayLabel(offset, dayIndex)} à ${formatTime(next.opens)}`,
      };
    }
  }

  return { isOpen: false, label: 'Fermé' };
}

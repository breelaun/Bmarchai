import { format, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

export const formatToLocalTime = (date: string | Date, timezone: string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(parsedDate, timezone, 'PPpp');
};

export const getCurrentTimezoneOffset = (timezone: string): number => {
  const date = new Date();
  const timeString = formatInTimeZone(date, timezone, 'xxx');
  const match = timeString.match(/([+-])(\d{2}):(\d{2})/);
  
  if (!match) return 0;
  
  const [, sign, hours, minutes] = match;
  const offset = parseInt(hours) * 60 + parseInt(minutes);
  return sign === '+' ? offset : -offset;
};

export const convertToTimezone = (date: Date, fromTimezone: string, toTimezone: string): Date => {
  const fromOffset = getCurrentTimezoneOffset(fromTimezone);
  const toOffset = getCurrentTimezoneOffset(toTimezone);
  const diffMinutes = toOffset - fromOffset;
  
  return new Date(date.getTime() + diffMinutes * 60 * 1000);
};
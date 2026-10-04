// engine/types.js — Constants and data structures

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
const DAY_SHORT = { 'Pazartesi': 'Pzt', 'Salı': 'Sal', 'Çarşamba': 'Çar', 'Perşembe': 'Per', 'Cuma': 'Cum' };

const TIME_SLOTS = [
  '08:30', '09:30', '10:30', '11:30', '12:30',
  '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:30'
];

const SLOT_LABELS = [
  '08:30-09:20', '09:30-10:20', '10:30-11:20', '11:30-12:20', '12:30-13:20',
  '13:30-14:20', '14:30-15:20', '15:30-16:20', '16:30-17:20', '17:30-18:20',
  '18:30-19:20', '19:30-20:20'
];

/**
 * Convert "HH:MM" to minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert minutes since midnight to "HH:MM"
 */
function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Get the time slot index for a given time string
 */
function getSlotIndex(timeStr) {
  return TIME_SLOTS.indexOf(timeStr);
}

/**
 * Get the number of slots a time range spans
 */
function getSlotSpan(startTime, endTime) {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  return Math.ceil((endMins - startMins) / 60);
}

/**
 * Course color by index
 */
function getCourseColorIndex(courseCode, allCodes) {
  const idx = allCodes.indexOf(courseCode);
  return idx % 7;
}

// engine/validator.js — Conflict detection and data validation

/**
 * Check if two time ranges overlap.
 * A slot ending at X and another starting at X+10min is allowed (10-min gap rule).
 */
function doTimesOverlap(slot1, slot2) {
  if (slot1.day !== slot2.day) return false;
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);
  
  // Require at least 10 minutes gap
  return !(end1 + 10 <= start2 || end2 + 10 <= start1);
}

/**
 * Check if a new selection conflicts with existing selections.
 * Returns true if there is a conflict.
 */
function hasConflict(existingSlots, newSlots) {
  for (const existing of existingSlots) {
    for (const newSlot of newSlots) {
      if (doTimesOverlap(existing, newSlot)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get all time slots from a selection (a chosen section for a course component).
 * Attaches course metadata to each slot for display.
 */
function getSelectionSlots(course, component, section) {
  return section.slots.map(slot => ({
    ...slot,
    courseCode: course.code,
    courseName: course.name,
    component: component.component,
    sectionNum: section.section,
    instructor: section.instructor || '',
    room: section.room || ''
  }));
}

/**
 * Validate that the schedule has no conflicts with a "free day" constraint.
 * Returns true if schedule respects the constraint.
 */
function respectsFreeDays(allSlots, freeDays) {
  if (!freeDays || freeDays.length === 0) return true;
  for (const slot of allSlots) {
    if (freeDays.includes(slot.day)) {
      return false;
    }
  }
  return true;
}

/**
 * Validate JSON course data structure.
 * Returns { valid: boolean, errors: string[] }
 */
function validateCourseData(data) {
  const errors = [];
  
  if (!data || !data.courses) {
    errors.push('JSON dosyasında "courses" dizisi bulunamadı.');
    return { valid: false, errors };
  }
  
  if (!Array.isArray(data.courses)) {
    errors.push('"courses" bir dizi olmalıdır.');
    return { valid: false, errors };
  }
  
  for (const course of data.courses) {
    if (!course.code) errors.push(`Ders kodu eksik.`);
    if (!course.name) errors.push(`${course.code || '?'}: Ders adı eksik.`);
    if (!course.components || !Array.isArray(course.components)) {
      errors.push(`${course.code || '?'}: "components" dizisi eksik.`);
      continue;
    }
    
    for (const comp of course.components) {
      if (!comp.sections || !Array.isArray(comp.sections)) {
        errors.push(`${course.code} ${comp.component || '?'}: "sections" dizisi eksik.`);
        continue;
      }
      
      for (const sec of comp.sections) {
        if (sec.section === undefined) {
          errors.push(`${course.code} ${comp.component}: Şube numarası eksik.`);
        }
        if (!sec.slots || !Array.isArray(sec.slots) || sec.slots.length === 0) {
          errors.push(`${course.code} Şube ${sec.section}: Zaman slotları eksik.`);
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

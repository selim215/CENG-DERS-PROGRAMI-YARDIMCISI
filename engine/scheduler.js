// engine/scheduler.js — Backtracking-based schedule permutation generator

/**
 * Build the "decision units" from course data.
 * 
 * For COMMON courses (type: "common"):
 *   - All components of a course share the same section number.
 *   - E.g., if a student picks MATH101 Section 5, ALL slots under Section 5 are fixed.
 *   - Each section is one decision: "pick section X for this course (all components)".
 * 
 * For DEPARTMENTAL courses (type: "departmental"):
 *   - Theory and Lab components are INDEPENDENT.
 *   - Student can pick Theory Section 1 + Lab Section 2.
 *   - Each component is a separate decision unit.
 */
/**
 * Build the "decision units" from course data.
 * Supports lockedSections hard constraint.
 */
function buildDecisionUnits(courses, instructorFilters = {}, lockedSections = {}) {
  const units = [];
  
  for (const course of courses) {
    const allowedInstructors = instructorFilters[course.code] || null;

    if (course.type === 'common') {
      // Common courses: group all components by section number
      const lockedSec = lockedSections[course.code];
      const sectionMap = {};
      
      for (const comp of course.components) {
        for (const sec of comp.sections) {
          if (lockedSec !== undefined && sec.section !== lockedSec) continue;
          if (lockedSec === undefined && allowedInstructors && !allowedInstructors.includes(sec.instructor)) continue;

          if (!sectionMap[sec.section]) {
            sectionMap[sec.section] = {
              section: sec.section,
              slots: [],
              details: []
            };
          }
          const taggedSlots = sec.slots.map(s => ({
            ...s,
            courseCode: course.code,
            courseName: course.name,
            component: comp.component,
            sectionNum: sec.section,
            instructor: sec.instructor || '',
            room: sec.room || ''
          }));
          sectionMap[sec.section].slots.push(...taggedSlots);
          sectionMap[sec.section].details.push({
            component: comp.component,
            instructor: sec.instructor,
            room: sec.room
          });
        }
      }
      
      const options = Object.values(sectionMap);
      if (options.length > 0) {
        units.push({
          id: course.code,
          courseCode: course.code,
          courseName: course.name,
          type: 'common',
          label: `${course.code} - ${course.name}`,
          options
        });
      }
      
    } else {
      // Departmental courses: each component is a separate decision
      for (const comp of course.components) {
        const compLabel = comp.component === 'theory' ? 'Teori' : 
                         comp.component === 'lab' ? 'Lab' : comp.component;
        const unitId = `${course.code}_${comp.component}`;
        const lockedSec = lockedSections[unitId];

        const validSections = comp.sections.filter(sec => {
          if (lockedSec !== undefined) return sec.section === lockedSec;
          if (allowedInstructors && !allowedInstructors.includes(sec.instructor)) return false;
          return true;
        });

        if (validSections.length > 0) {
          units.push({
            id: unitId,
            courseCode: course.code,
            courseName: course.name,
            type: 'departmental',
            component: comp.component,
            label: `${course.code} ${compLabel} - ${course.name}`,
            options: validSections.map(sec => ({
              section: sec.section,
              slots: sec.slots.map(s => ({
                ...s,
                courseCode: course.code,
                courseName: course.name,
                component: comp.component,
                sectionNum: sec.section,
                instructor: sec.instructor || '',
                room: sec.room || ''
              })),
              details: [{
                component: comp.component,
                instructor: sec.instructor,
                room: sec.room
              }]
            }))
          });
        }
      }
    }
  }
  
  return units;
}

/**
 * Generate all valid schedule permutations using backtracking.
 * 
 * @param {Array} courses - Course data
 * @param {Array} freeDays - Days to keep free (e.g., ['Cuma'])
 * @param {Object} instructorFilters - Allowed instructors per course
 * @param {Number} maxResults - Maximum number of results to generate
 * @param {Object} lockedSections - Hard constraint locked sections { unitId: sectionNum }
 * @param {Array} previousSelections - Previously selected sections to preserve preferences
 * @returns {Array} Array of valid schedules
 */
function generateSchedules(courses, freeDays = [], instructorFilters = {}, maxResults = 500, lockedSections = {}, previousSelections = []) {
  const units = buildDecisionUnits(courses, instructorFilters, lockedSections);
  const totalExpectedUnits = courses.reduce((acc, c) => acc + (c.type === 'common' ? 1 : c.components.length), 0);
  if (units.length < totalExpectedUnits) return [];

  const results = [];
  
  function backtrack(unitIndex, currentSlots, currentSelections) {
    if (results.length >= maxResults) return;
    
    if (unitIndex === units.length) {
      // All units have been assigned — this is a valid schedule
      results.push({
        selections: [...currentSelections],
        slots: [...currentSlots],
        score: calculateCompactnessScore(currentSlots)
      });
      return;
    }
    
    const unit = units[unitIndex];
    
    for (const option of unit.options) {
      // Check free day constraint
      if (freeDays.length > 0) {
        const violatesFreeDays = option.slots.some(s => freeDays.includes(s.day));
        if (violatesFreeDays) continue;
      }
      
      // Check conflict with existing selections
      if (hasConflict(currentSlots, option.slots)) continue;
      
      // Valid option — recurse
      currentSelections.push({
        unitId: unit.id,
        courseCode: unit.courseCode,
        courseName: unit.courseName,
        component: unit.component || 'all',
        section: option.section,
        slots: option.slots
      });
      
      currentSlots.push(...option.slots);
      
      backtrack(unitIndex + 1, currentSlots, currentSelections);
      
      // Backtrack
      currentSelections.pop();
      currentSlots.splice(currentSlots.length - option.slots.length, option.slots.length);
    }
  }
  
  backtrack(0, [], []);
  
  // Sort: prioritize keeping previous selections when possible, then compactness score
  results.sort((a, b) => {
    if (previousSelections && previousSelections.length > 0) {
      let aMatches = 0;
      let bMatches = 0;
      for (const p of previousSelections) {
        if (a.selections.some(s => s.courseCode === p.courseCode && s.component === p.component && s.section === p.section)) {
          aMatches++;
        }
        if (b.selections.some(s => s.courseCode === p.courseCode && s.component === p.component && s.section === p.section)) {
          bMatches++;
        }
      }
      if (bMatches !== aMatches) {
        return bMatches - aMatches;
      }
    }
    return a.score.totalGap - b.score.totalGap;
  });
  
  return results;
}

/**
 * Calculate compactness score for a schedule.
 * Lower totalGap = more compact = better.
 */
function calculateCompactnessScore(slots) {
  const daySlots = {};
  
  for (const slot of slots) {
    if (!daySlots[slot.day]) daySlots[slot.day] = [];
    daySlots[slot.day].push(slot);
  }
  
  let totalGap = 0;
  let activeDays = 0;
  let totalHours = 0;
  let maxDailyGap = 0;
  
  for (const day of DAYS) {
    const slotsForDay = daySlots[day];
    if (!slotsForDay || slotsForDay.length === 0) continue;
    
    activeDays++;
    
    // Sort by start time
    const sorted = slotsForDay.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    
    // Calculate total hours
    for (const s of sorted) {
      totalHours += (timeToMinutes(s.end) - timeToMinutes(s.start)) / 60;
    }
    
    // Calculate gaps between consecutive classes
    let dayGap = 0;
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = timeToMinutes(sorted[i - 1].end);
      const currStart = timeToMinutes(sorted[i].start);
      const gap = currStart - prevEnd;
      if (gap > 0) {
        dayGap += gap;
      }
    }
    
    totalGap += dayGap;
    maxDailyGap = Math.max(maxDailyGap, dayGap);
  }
  
  return {
    totalGap,           // Total gap in minutes (lower = better)
    activeDays,         // Number of days with classes
    totalHours: Math.round(totalHours * 10) / 10,
    maxDailyGap,        // Worst daily gap in minutes
    avgGapPerDay: activeDays > 0 ? Math.round(totalGap / activeDays) : 0
  };
}

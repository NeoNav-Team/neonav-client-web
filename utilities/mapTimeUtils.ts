export function compressHoursAcrossMidnight (hoursData: any[]): any[] {
  // Helper function to convert 24-hour time to 12-hour format
  const formatTime = (time24: string) => {
    if (time24 === "24:00") return "12:00AM";
    if (time24 === "00:00") return "12:00AM";
    
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
  };

  // Helper function to get next day
  const getNextDay = (day: string) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentIndex = days.indexOf(day.toLowerCase());
    return days[(currentIndex + 1) % 7];
  };

  // Group hours by day
  const dayGroups: { [key: string]: any[] } = {};
  
  hoursData.forEach(hour => {
    if (!dayGroups[hour.day]) {
      dayGroups[hour.day] = [];
    }
    dayGroups[hour.day].push(hour);
  });

  // Process each day's hours
  const compressedRows: any[] = [];
  const processedDays = new Set<string>();
  
  // Get all days in order (start from Wednesday to maintain logical flow)
  const allDays = ['wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'monday', 'tuesday'];
  const daysInOrder = allDays.filter(day => dayGroups[day]);
  
  daysInOrder.forEach(day => {
    const dayHours = dayGroups[day];
    
    // Separate regular hours from midnight hours
    const regularHours = dayHours.filter(h => h.open !== "00:00" && h.close !== "00:00");
    const midnightHours = dayHours.filter(h => h.open === "00:00");
    
    // Skip days that have only midnight hours and have already been processed
    if (processedDays.has(day) && regularHours.length === 0) {
      compressedRows.push({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: ["Closed"]
      });
      return;
    }
    
    if (regularHours.length > 0) {
      // Sort regular hours by opening time
      const sortedRegularHours = regularHours.sort((a, b) => a.open.localeCompare(b.open));
      
      // Check if THIS day also has midnight hours
      if (midnightHours.length > 0) {
        // This day has both regular hours and midnight hours
        const latestMidnightClose = midnightHours
          .map(h => h.close)
          .sort()
          .pop();
        
        // Check if regular hours close at midnight (24:00) - if so, extend the last period
        const latestRegularClose = sortedRegularHours
          .map(h => h.close)
          .sort()
          .pop();
        
        if (latestRegularClose && latestRegularClose === "24:00") {
          // Check if NEXT day has midnight hours that extend the closing time
          const nextDay = getNextDay(day);
          const nextDayHours = dayGroups[nextDay] || [];
          const nextDayMidnightHours = nextDayHours.filter(h => h.open === "00:00");
          
          if (nextDayMidnightHours.length > 0) {
            const latestNextDayMidnightClose = nextDayMidnightHours
              .map(h => h.close)
              .sort()
              .pop();
            
            // Extend the last regular period to include next day's midnight hours
            const extendedPeriods = [...sortedRegularHours];
            extendedPeriods[extendedPeriods.length - 1] = {
              ...extendedPeriods[extendedPeriods.length - 1],
              close: latestNextDayMidnightClose
            };
            
            compressedRows.push({
              day: day.charAt(0).toUpperCase() + day.slice(1),
              hours: extendedPeriods.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
            });
            
            // Only mark the next day as processed if it has only midnight hours
            if (nextDayHours.filter(h => h.open !== "00:00" && h.close !== "00:00").length === 0) {
              processedDays.add(nextDay);
            }
          } else {
            // No next day midnight hours, extend to current day's midnight hours
            const extendedPeriods = [...sortedRegularHours];
            extendedPeriods[extendedPeriods.length - 1] = {
              ...extendedPeriods[extendedPeriods.length - 1],
              close: latestMidnightClose
            };
            
            compressedRows.push({
              day: day.charAt(0).toUpperCase() + day.slice(1),
              hours: extendedPeriods.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
            });
          }
        } else {
          // Show midnight hours and regular hours as separate periods
          const allPeriods = [
            `${formatTime("00:00")} - ${formatTime(latestMidnightClose!)}`,
            ...sortedRegularHours.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
          ];
          
          compressedRows.push({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            hours: allPeriods
          });
        }
      } else {
        // Only regular hours - check if NEXT day has midnight hours that extend the closing time
        const nextDay = getNextDay(day);
        const nextDayHours = dayGroups[nextDay] || [];
        const nextDayMidnightHours = nextDayHours.filter(h => h.open === "00:00");
        
        if (nextDayMidnightHours.length > 0) {
          const latestNextDayMidnightClose = nextDayMidnightHours
            .map(h => h.close)
            .sort()
            .pop();
          
          // Only extend if there's no gap (regular close is at midnight)
          if (latestNextDayMidnightClose && latestNextDayMidnightClose !== "00:00") {
            // Check if regular hours close at midnight (24:00) - no gap
            const latestRegularClose = sortedRegularHours
              .map(h => h.close)
              .sort()
              .pop();
            
            if (latestRegularClose && latestRegularClose === "24:00") {
              // No gap, extend the last period to include midnight hours
              const extendedPeriods = [...sortedRegularHours];
              extendedPeriods[extendedPeriods.length - 1] = {
                ...extendedPeriods[extendedPeriods.length - 1],
                close: latestNextDayMidnightClose
              };
              
              compressedRows.push({
                day: day.charAt(0).toUpperCase() + day.slice(1),
                hours: extendedPeriods.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
              });
              
              // Only mark the next day as processed if it has only midnight hours
              if (nextDayHours.filter(h => h.open !== "00:00" && h.close !== "00:00").length === 0) {
                processedDays.add(nextDay);
              }
            } else {
              // There's a gap, show all regular periods separately
              compressedRows.push({
                day: day.charAt(0).toUpperCase() + day.slice(1),
                hours: sortedRegularHours.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
              });
            }
          } else {
            // No midnight extension, show all regular periods
            compressedRows.push({
              day: day.charAt(0).toUpperCase() + day.slice(1),
              hours: sortedRegularHours.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
            });
          }
        } else {
          // No midnight extension, show all regular periods
          compressedRows.push({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            hours: sortedRegularHours.map(h => `${formatTime(h.open)} - ${formatTime(h.close)}`)
          });
        }
      }
    } else if (midnightHours.length > 0) {
      // Only midnight hours - show them as late night hours
      const latestMidnightClose = midnightHours
        .map(h => h.close)
        .sort()
        .pop();
      
      compressedRows.push({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: [`12:00AM - ${formatTime(latestMidnightClose!)}`]
      });
    } else {
      // No hours data for this day
      compressedRows.push({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: ["Closed"]
      });
    }
  });

  return compressedRows;
}

// Function to parse a time string like "10:00AM" or "7:00PM"
const parseTimeString = (timeStr: string, refDate: Date) => {
  const ampm = timeStr.slice(-2);
  let [hours, minutes] = timeStr.slice(0, -2).split(":").map(Number);
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  const date = new Date(refDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export function generateOpenMessages(prettyhours: any[]): {openState: string, nextTimeMsg: string} {

  // Find today's row in prettyHours
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  if (!prettyhours) return {openState: "", nextTimeMsg: ""};

  let todayRow = prettyhours.find((row: any) => row.day.toLowerCase() === dayOfWeek);
  // Fallback if not found - possible capitalisation error
  if (!todayRow && prettyhours.length) {
    todayRow = prettyhours.find((row: any) => row.day.toLowerCase().startsWith(dayOfWeek.substring(0, 3)));
  }
  let openState = "Closed";
  let nextTimeMsg = "";
  if (todayRow && Array.isArray(todayRow.hours)) {
    // E.g. ["10:00AM - 7:00PM", ...] or ["Closed"]
    for (let i = 0; i < todayRow.hours.length; i++) {
      const hoursString = todayRow.hours[i];
      if (hoursString === "Closed") continue;

      // Split into open/close time
      const [openStr, closeStr] = hoursString.split(" - ");
      if (!openStr || !closeStr) continue;

      // Construct today's open and close Date objects
      const openTime = parseTimeString(openStr, now);
      let closeTime = parseTimeString(closeStr, now);

      // If close time is <= open time, must run into tomorrow
      if (closeTime <= openTime) {
        closeTime.setDate(closeTime.getDate() + 1);
      }

      // Are we open right now?
      if (now >= openTime && now < closeTime) {
        openState = "Open";
        // Show closes at...
        nextTimeMsg = `Closes ${closeStr}`;
        break;
      } else if (now < openTime) {
        // Not yet open today, show "Opens at..."
        openState = "Closed";
        nextTimeMsg = `Opens ${openStr}`;
        break;
      }
      // else, keep looking (could have multiple periods)
    }
    if (openState === "Closed" && !nextTimeMsg) {
      // Check tomorrow's hours for next opening
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowDay = tomorrow.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      let tomorrowRow = prettyhours.find((row: any) => row.day.toLowerCase() === tomorrowDay);
      if (!tomorrowRow && prettyhours.length) {
        tomorrowRow = prettyhours.find((row: any) => row.day.toLowerCase().startsWith(tomorrowDay.substring(0, 3)));
      }
      if (tomorrowRow && Array.isArray(tomorrowRow.hours)) {
        for (let i = 0; i < tomorrowRow.hours.length; i++) {
          const hoursString = tomorrowRow.hours[i];
          if (hoursString === "Closed") continue;
          const [openStr] = hoursString.split(" - ");
          if (openStr) {
            nextTimeMsg = `Opens ${openStr} ${tomorrowRow.day}`;
            break;
          }
        }
      }
    }
  }

  return {openState, nextTimeMsg};
}
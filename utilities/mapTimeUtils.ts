export function compressHoursAcrossMidnight(hoursData: any[]): any[] {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const formatTime = (t: string) => {
    if (t === "24:00" || t === "00:00") return "12:00AM";
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, '0')}${period}`;
  };

  // Group and sort hours by day
  const schedule: Record<string, any[]> = {};
  hoursData.forEach(h => {
    if (!schedule[h.day]) schedule[h.day] = [];
    schedule[h.day].push(h);
  });
  days.forEach(d => {
    if (schedule[d]) schedule[d].sort((a, b) => a.open.localeCompare(b.open));
  });

  const result: any[] = [];
  const skipNextMorning = new Set<string>();

  // Process logically starting from Wednesday
  const order = ['wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'monday', 'tuesday'];
  
  order.forEach((day, index) => {
    const dayHours = schedule[day] || [];
    const nextDay = order[(index + 1) % 7];
    const nextDayHours = schedule[nextDay] || [];

    // Filter out morning hours if they were already merged into "yesterday"
    let currentDayPeriods = dayHours.filter(h => {
      const isMorning = h.open === "00:00" && h.close <= "04:00";
      return !(isMorning && skipNextMorning.has(day));
    });

    if (currentDayPeriods.length === 0) {
      result.push({ day: day.charAt(0).toUpperCase() + day.slice(1), hours: ["Closed"] });
      return;
    }

    const formattedHours = currentDayPeriods.map(period => {
      let open = period.open;
      let close = period.close;

      // JOIN LOGIC: If this period ends at Midnight, check if next day opens at Midnight 
      // and closes before 4:00 AM.
      if (close === "24:00") {
        const joinable = nextDayHours.find(h => h.open === "00:00" && h.close <= "04:00");
        if (joinable) {
          close = joinable.close;
          skipNextMorning.add(nextDay); // Don't show this 00:00-04:00 block on its own day
        }
      }

      // SPECIAL LABEL: Check for 24-hour status after merging
      if (open === "00:00" && close === "24:00") {
        return "Open 24 hours";
      }

      return `${formatTime(open)} - ${formatTime(close)}`;
    });

    result.push({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: formattedHours
    });
  });

  return result;
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
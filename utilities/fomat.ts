const LANDFALL = 2021;

export const isoDateToDaily = (isoDate:string) => {
    return new Date(isoDate).toLocaleDateString(
        'en-gb',
        {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }
      );
}

export const isoDateToMonth = (isoDate:string) => {
    const calendarDate = isoDate.split('T')[0];
    const calArr = calendarDate.split('-');
    const differnce = (parseInt(calArr[0], 10) - LANDFALL);
    return `✦ ${calArr[1]}-${calArr[2]}  ❂ ${ordinal(differnce)}`;
}

const ordinal = (i:number) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export const orderbyDate = (arrayObject:Record<string, string>[], dateKey:string) => {
    return arrayObject.sort(function(a, b){
        return new Date(b[dateKey]).valueOf() - new Date(a[dateKey]).valueOf();
    });   
}
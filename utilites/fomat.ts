import { NnIndexCollection } from '../components/context/nnTypes';

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

export const isoDateToOrbit = (isoDate:string) => {
    const year =  new Date().toLocaleDateString('en-gb',{year: 'numeric'});
    const differnce = (parseInt(year, 10) - LANDFALL);
    return `${ordinal(differnce)}`;
}

export const isoDateToMonth = (isoDate:string) => {
    const month =  new Date().toLocaleDateString('en-gb',{month: '2-digit'});
    return `${ordinal(parseInt(month, 10))}`;
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
import { LooseObject } from '../components/context/nnTypes';

const isEmpty = (obj:LooseObject) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

export default isEmpty;
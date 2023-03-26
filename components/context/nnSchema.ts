import { NnStore } from "./nnTypes";
import { globalChannel } from "@/utilites/constants";

const GLOBAL_CHANNEL = globalChannel;

export const nnSchema:NnStore = {
  network: { 
    location: 'loading...',
    alert: {
      severity: 'info',
      message: '',
      show: false,
    },
    selected: {
      transactions: '',
      account: '',
      contact: '',
      channel: GLOBAL_CHANNEL,
    },
    collections: {
      messages: [],
      transactions: [],
      contacts: [],
      entityUsers: [],
      factions: [],
      statuses: [],
      privateStatuses: [],
      scannedEntities: [],
    },
    entity: {}
  },
  user: {
    profile: {
      auth: {
        userid: '',
      },
      meta: {
        username: '',
      }
    },
    channels: [],
    wallets: [],
    notifcations: [],
    factions: [],
  },
};
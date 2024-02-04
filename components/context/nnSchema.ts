import { NnStore } from "./nnTypes";
import { globalChannel } from "@/utilities/constants";

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
      unread: {},
    },
    collections: {
      messages: [],
      transactions: [],
      contacts: [],
      entityUsers: [],
      factions: [],
      statuses: [],
      scannedEntities: [],
    },
    entity: {},
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
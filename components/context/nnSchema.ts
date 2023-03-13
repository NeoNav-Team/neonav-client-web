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
      scannedUsers: [],
    },
    entity: {}
  },
  user: {
    profile: {
      auth: {
        userid: '',
        email: '',
        emailverified: false,
        lastlogin: '',
        lastip: '',
      },
      meta: {
        firstname: '',
        lastname: '',
        username: '',
        skills: '',
        status: '',
        occupation: '',
        avatar: '',
        bio: '',
      }
    },
    channels: [],
    wallets: [],
    notifcations: [],
    factions: [],
  },
};
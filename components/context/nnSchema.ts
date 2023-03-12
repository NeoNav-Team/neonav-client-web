import { NnStore } from "./nnTypes";
import { globalChannel } from "@/utilites/constants";

const GLOBAL_CHANNEL = globalChannel;
const NOW = new Date().toISOString();

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
      channel: GLOBAL_CHANNEL,
    },
    localStorage: {
      transactions: [],
      chats: [],
      channels: [],
    },
    collections: {
      messages: [],
      transactions: [],
      contacts: [],
      scannedUsers: [],
    }
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
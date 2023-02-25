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
      apiLastFetch: {
        profile: '',
        wallets: '',
        walletHistory: '',
      },
      selected: {
        transactions: '',
        account: '',
        channel: GLOBAL_CHANNEL,
      },
      collections: {
        chats: [],
        transactions: [],
        users: [
          {
            id: 'contacts',
            collection: [],
          },
          {
            id: 'scannedUsers',
            collection: [],
          }
        ],
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
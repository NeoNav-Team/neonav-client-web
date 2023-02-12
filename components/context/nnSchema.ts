import { NnStore } from "./nnTypes";

export const nnSchema:NnStore = {
    network: { 
      location: 'loading...',
      APILastFetch: {
        profile: '',
        wallets: '',
        walletHistory: '',
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
      contacts: [],
      channels: [],
      wallets: [],
      notifcations: [],
      factions: [],
    },
  };
import { NnStore } from "./nnTypes";

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
        account: '',
        channel: '',
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

type ProviderValues = {
    state: NnStore,
    [key: string]: Object | Function,
};

export type NnStore = {
    network?: NnNetwork,
    user?: NnUser,
}

export type NnAlert = {
    severity?: 'success' | 'error' | 'info' | 'warning',
    message?: string,
    show: boolean,
}

export type NnProfileAuth = {
    userid: string,
    email?: string,
    emailverified?: boolean,
    lastlogin?: string,
    lastip?: string,
}

export type NnProfileMeta = {
    firstname?: string,
    lastname?: string,
    username?: string,
    skills?: string
    status?: string,
    occupation?: string,
    avatar?: string,
    bio?: string,
}

export type NnUserProfile = {
    auth: NnProfileAuth,
    meta: NnProfileMeta,
}

export type NnWalletTransaction = {
    id?: any;
    ts?: string,
    amount?: number | string,
    user?: string,
    username?: string,
}

export type NnWallet = {
    type?: string;
    id?: string,
    owner?: string,
    name?: string,
    balance?: number,
}

export type NnContact = {
    id: string,
    username: string,
    status?: string,
}

export type NnChannel = {
    id: string,
    name: string,
    scope: string,
    admin: string,
}

export type NnChatMessage = {
    id?: string,
    ts?: string,
    channel?: string,
    fromid?: string,
    from?: string,
    text?: string,
}

export type NnFaction = {
    id: string,
    admin: string,
    name: string,
}

export type nnEntity = {
    id?: string;
    type?: string;
    name?: string;
    description?: string;
    image?: string;
    meta?: any;
}

export type NnCollection = NnWalletTransaction[] & NnChatMessage[] & NnContact[];

export type NnNetwork = {
    alert: NnAlert,
    location?: string,
    lastFetched?: string,
    selected: {
        transactions?: string,
        account?: string,
        channel?: string,
        contact?: string,
    },
    collections: {
        messages?: NnChatMessage[],
        transactions?: NnWalletTransaction[],
        contacts?: NnContact[],
        scannedUsers?: NnContact[],
    }
    entity: nnEntity;
}

export type NnUser = {
    profile?: NnUserProfile,
    wallets?: NnWallet[],
    channels?: NnChannel[],
    notifcations?: NnChatMessage[],
    factions?: NnFaction[],
}

export type NnCollectionKeys = 'chats' | 'transactions' | 'users';

export type ActionTypes =
  'addMessage' | 
  'setNetwork' | 
  'setAlert' |
  'setEntity' | 
  'setUserChannels' |
  'setUserFactions' |
  'setUserWallets' | 
  'setWalletTransactions' |
  'setUserContacts' | 
  'setChatMessages' |
  'setMessageHistory' |
  'setSelected' |
  'updateMessageHistory' |
  'initContext';

export interface Action {
    type: ActionTypes,
    payload?: Object,
  }

export type DispatchFunc = (dispatch: Action) => void;
  
export type errorAPIResData = {
    message?: String;
}

export interface walletAPIResData {
    balance?: Number;
    owner?: String;
  }
  
export interface netcheckAPIResData {
    message?: String;
  }
  
export interface APIResData extends walletAPIResData, netcheckAPIResData {
    _id: String;
    _rev: String;
  }
  
export interface APIResponse {
    data: APIResData;
}

export type NnProviderDispatch = {
    closeAlert: () => void;
    fetchNetworkStatus: () => void;
    fetchUserWallets: () => void;
    fetchUserContacts: () => void;
    fetchContact: (_userId:string, _verbose?:boolean) => void;
    fetchUserChannels: () => void;
    fetchUserFactions: () => void;
    fetchChannelHistory: (_channelId:string) => void;
    fetchUserWalletHistory: () => void;
    initContext: () => void;
    longPollMessages: (_since:string) => void;
    requestPayment: (_userId:string, _amount:string) => void;
    sendPayment: (_user:string, _amount:string) => void;
    sendFactionPayment: (_factionId:string, _userId:string, _amount:string) => void;
    sendChannelMessage: (_channelId:string, _text:string) => void;
    setSelected: (_indexType:string, _index:string) => void;
    unfriend: (_exFriendId:string) => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


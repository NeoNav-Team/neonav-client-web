
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
    id?: string,
    userid?: string,
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


/* Entity is currently a catch-all but realistically shoudld be <NnFaction | NnChannel | NnUser | NnProduct> */
export type nnEntity = {
    id?: string;
    userid?: string;
    type?: string;
    name?: string;
    username?: string;
    description?: string;
    image?: string;
    meta?: any;
    reps?: any;
    members?: any;
    admin?: any;
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
        entityUsers?: NnContact[],
        scannedEntities?: NnContact[] | NnFaction[],
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
  'setEntityUserlist' | 
  'setUserChannels' |
  'setUserFactions' |
  'setUserWallets' | 
  'setWalletTransactions' |
  'setUserContacts' | 
  'setChatMessages' |
  'setMessageHistory' |
  'setSelected' |
  'updateMessageHistory' |
  'removeUserFromChannel' | 
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
    adminUserToChannel: (_channelId:string,_userId:string)=> void;
    closeAlert: () => void;
    createNewChannel: (_channelName:string) => void;
    fetchNetworkStatus: () => void;
    fetchUserWallets: () => void;
    fetchUserContacts: () => void;
    fetchContact: (_userId:string, _verbose?:boolean) => void;
    fetchUserChannels: () => void;
    fetchUserFactions: () => void;
    fetchChannelHistory: (_channelId:string) => void;
    fetchChannelDetails: (_channelId:string) => void;
    fetchChannelUsers: (_channelId:string) => void;
    fetchFactionDetails: (_factionId:string) => void;
    fetchFactionUsers: (_factionId:string) => void;
    removeUserFromFaction: (_factionId:string, _userId:string) => void;
    addUserToFaction: (_factionId:string, _userId:string) => void;
    adminUserToFaction: (_factionId:string, _userId:string) => void;
    fetchUserWalletHistory: () => void;
    initContext: () => void;
    joinUserToChannel: (_channelId:string) => void;
    longPollMessages: (_since:string) => void;
    removeUserFromChannel: (_channelId:string,_userId:string) => void;
    requestPayment: (_userId:string, _amount:string) => void;
    sendPayment: (_user:string, _amount:string) => void;
    sendFactionPayment: (_factionId:string, _userId:string, _amount:string) => void;
    sendChannelMessage: (_channelId:string, _text:string) => void;
    setSelected: (_indexType:string, _index:string) => void;
    toggleChannelScope: (_channelId:string) => void;
    unfriend: (_exFriendId:string) => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


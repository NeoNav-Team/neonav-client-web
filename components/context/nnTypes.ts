
type ProviderValues = {
    state: NnStore,
    [key: string]: Object | Function,
};

export type NnStore = {
    network?: NnNetwork,
    user?: NnUser,
}

export type NnFetchDates = {
    profile?: string,
    wallets?: string,
    walletHistory?: string,
}

export type NnAert = {
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
    id: any;
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
    username?: string,
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

export type NnCollection = NnWalletTransaction[] & NnChatMessage[] & NnContact[];

export type NnIndexCollection = {
    id: string,
    collection?: NnCollection;
}

export type NnNetwork = {
    alert: NnAert,
    location?: string,
    apiLastFetch?: NnFetchDates,
    selected: {
        transactions?: string,
        account?: string,
        channel?: string,
    },
    collections: {
        chats?: NnIndexCollection[],
        transactions?: NnIndexCollection[],
        users?: NnIndexCollection[],
    }
}

export type NnUser = {
    profile?: NnUserProfile,
    wallets?: NnWallet[],
    channels?: NnChannel[],
    notifcations?: [],
    factions?: [],
}

export type NnCollectionKeys = 'chats' | 'transactions' | 'users';

export type ActionTypes = 'setNetwork' | 
  'setAlert' |
  'setUserChannels' |
  'setUserWallets' | 
  'setWalletTransactions' |
  'setUserContacts' | 
  'setChatMessages' |
  'setMessageHistory' |
  'setSelected' |
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
    fetchUserChannels: () => void;
    fetchChannelHistory: (_channelId:string) => void;
    fetchUserWalletHistory: () => void;
    requestPayment: (_user:string, _amount:string) => void;
    sendPayment: (_user:string, _amount:string) => void;
    setSelected: (_indexType:string, _index:string) => void;
    initContext: () => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


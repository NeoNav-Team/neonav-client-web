
export type LooseObject = {
    [key: string]: any
}
  
export type ProviderValues = {
    state: NnStore,
    [key: string]: Object | Function,
}

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
    meta: NnProfileMeta,
    auth?: NnProfileAuth,
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
    thumbnail: string | undefined;
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

export type NnStatus = {
    id: string,
    class: string,
    sender: string,
    ts?: string,
    from?: string,
    body?: string,
    target?: string,
}

export type NnChatMessage = {
    id?: string,
    ts?: string,
    channel?: string,
    fromid?: string,
    from?: string,
    text?: string,
    confirm?: string,
    decline?: string,
    buttons?: any,
}

export type NnFaction = {
    thumbnail: string | undefined;
    id: string,
    admin: string,
    name: string,
}


/* Entity is currently a catch-all but realistically should be <NnFaction | NnChannel | NnUser | NnProfile | NnProduct> */
export type nnEntity = {
    firstname?: string;
    lastname?: string;
    occupation?: string;
    skills?: string;
    bio?: string;
    avatar?: string;
    profile?: any;
    id?: string;
    _id?: string;
    _rev?: string;
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
    auth?: NnProfileAuth,
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
        unread?: LooseObject,
    },
    collections: {
        messages?: NnChatMessage[],
        transactions?: NnWalletTransaction[],
        contacts?: NnContact[],
        entityUsers?: NnContact[],
        factions?: NnFaction[],
        statuses: NnStatus[],
        scannedEntities?: NnContact[] | NnFaction[],
    },
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
  'setFactions' | 
  'setUserWallets' | 
  'setWalletTransactions' |
  'setUserContacts' | 
  'setChatMessages' |
  'setUserStatuses' |
  'setUserHiddenStatuses' | 
  'setRecentlyScanned' |
  'setMessageHistory' |
  'removeStatus' |
  'setSelected' |
  'updateMessageHistory' |
  'removeUserFromChannel' | 
  'fetchUnreadCount' |
  'setUnreadCount' |
  'clearUnreadCountByType' |
  'clearAllUnreadCounts' |
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
    status?: number;
  }
  
export interface APIResData extends walletAPIResData, netcheckAPIResData {
    profile: any;
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
    fetchContact: (_userId:string) => void;
    fetchUserChannels: () => void;
    fetchUserFactions: () => void;
    fetchAllFactions: () => void;
    fetchChannelHistory: (_channelId:string) => void;
    fetchChannelDetails: (_channelId:string) => void;
    fetchChannelUsers: (_channelId:string) => void;
    fetchFactionDetails: (_factionId:string) => void;
    fetchFactionStatuses: (_factionId:string) => void;
    fetchUserProfile: () => void;
    fetchUnreadCount: () => void;
    updateUserProfile: (_document:any, _update:any) => void;
    removeUserFromFaction: (_factionId:string, _userId:string) => void;
    addUserToFaction: (_factionId:string, _userId:string) => void;
    adminUserToFaction: (_factionId:string, _userId:string) => void;
    setFactionUserStatus: (_factionId:string, _body:string, _userId?:string) => void;
    fetchUserSetStatuses: (_userId:string) => void;
    fetchUserWalletHistory: () => void;
    initContext: () => void;
    leaveFaction: (_factionId:string) => void;
    updateFactionProfile: (_factionId:string, _document:any, _update:any) => void;
    inviteUserToFaction: () => void;
    addRepToFaction: (_factionId:string, _userId:string) => void;
    removeRepToFaction: (_factionId:string, _userId:string) => void;
    joinFaction: (_factionId:string) => void;
    joinUserToChannel: (_channelId:string) => void;
    longPollMessages: (_since:string) => void;
    removeUserFromChannel: (_channelId:string,_userId?:string) => void;
    requestPayment: (_userId:string, _amount:string) => void;
    sendPayment: (_user:string, _amount:string) => void;
    sendFactionPayment: (_factionId:string, _userId:string, _amount:string) => void;
    sendChannelMessage: (_channelId:string, _text:string) => void;
    setSelected: (_indexType:string, _index:string) => void;
    fetchUserStatuses: (_userId:string) => void;
    setUserStatus: (_userId:string, _body:string) => void;
    removeStatus: (_statusId:string, _factionId?:string) => void;
    setUserHiddenStatus: (_userId:string, _body:string, _factionId?:string) => void;
    addRecentScan: (_user:nnEntity) => void;
    getUserSetStatuses: (_userId:string,  _factionId?:string) => void;
    toggleStatusClass: (_userId:string, _factionId?:string) => void;
    userSearch: (_search:string) => void;
    toggleChannelScope: (_channelId:string) => void;
    unfriend: (_exFriendId:string) => void;
    setUnreadCount: (_unread:LooseObject) => void;
    clearUnreadCountByType: (_channelId:string) => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


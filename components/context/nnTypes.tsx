
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

export type NnNetwork = {
    alert: NnAert,
    location?: string,
    apiLastFetch?: NnFetchDates,
    selectedAccount?: string,
    selectedChannel?: string,
    selectedFaction?: string,
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
    ts: string,
    amount: number | string,
    user: string,
    username: string,
}

export type NnWallet = {
    id?: string,
    owner?: string,
    name?: string,
    balance: number,
    transactions?: NnWalletTransaction[],
}

export type NnContact = {
    id: string,
    username?: string,
    status?: string,
}

export type NnChannel = {
    id: string,
    name: string,
    scope: string,
    admin: string,
}

export type NnUser = {
    profile?: NnUserProfile,
    wallets?: NnWallet[],
    contacts?: NnContact[],
    channels?: NnChannel[],
    notifcations?: [],
    factions?: [],
    scannedUsers?: NnContact[],
}

export type NnProviderDispatch = {
    closeAlert: () => void;
    fetchNetworkStatus: () => void;
    fetchUserWallets: () => void;
    fetchUserContacts: () => void;
    fetchUserChannels: () => void;
    fetchUserWalletHistory: (_walletId:string) => void;
    requestPayment: (_user:string, _amount:string) => void;
    sendPayment: (_user:string, _amount:string) => void;
    initContext: () => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


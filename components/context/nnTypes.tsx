
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

export type NnNetwork = {
    location?: string,
    APILastFetch?: NnFetchDates,
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

export type NnUser = {
    profile?: NnUserProfile,
    wallets?: NnWallet[],
    contacts?: [],
    channels?: [],
    notifcations?: [],
    factions?: [],
}

export type NnProviderDispatch = {
    fetchNetworkStatus: () => void;
    fetchUserWallets: () => void;
    initContext: () => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


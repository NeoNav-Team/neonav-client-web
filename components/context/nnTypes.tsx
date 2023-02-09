
type ProviderValues = {
    state: NnStore,
    [key: string]: Object | Function,
};

type NnStore = {
    network: NnNetwork,
    users?: NnUser[],
}

type NnNetwork = {
    location?: string,
}

type NnUser = {
    id: Object,
}

export type NnProviderDispatch = {
    fetchNetworkStatus: () => void;
}

export type NnProviderValues = ProviderValues & Partial<NnProviderDispatch>;


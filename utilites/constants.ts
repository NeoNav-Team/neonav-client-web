export const apiUrl = {
    protocol: 'https',
    hostname: process.env.API_DOMAIN || 'devapi.neonav.net',
    port: ''
};

export const authApiEnpoints = {
    login: {
        method: "post",
        path: "/api/auth"
    },
    verifyUser: {
        method: "get",
        path: "/api/auth/user"
    },
    tokenUpdate: {
        method: "patch",
        path: "/api/auth/user"
    },
    netCheck: {
        method: "get",
        path: "/api/auth/netcheck"       
    },
    profile: {
        method: "get",
        path: "/api/user"       
    },
    wallet: {
        method: "get",
        path: "/api/user/wallet"  
    },
    wallets: {
        method: "get",
        path: "/api/user/walletlist"  
    },
    contacts: {
        method: "get",
        path: "/api/user/friends"       
    }
};
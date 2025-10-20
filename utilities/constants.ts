// 0 is is notifications, 1 is announcements
export const restrictedChannels = [
  "d6993467030d7398f0415badd9186aa0",
  "22c6fec7b63257ca0d7b743946090fa9",
];
export const globalChannel = "22c6fec7b63257ca0d7b74394605813e";

export const apiUrl = {
  protocol: "https",
  hostname: process.env.API_DOMAIN || "devapi.neonav.net",
  port: "",
};

export const authApiEnpoints = {
  login: {
    method: "post",
    path: "/api/auth",
  },
  verifyUser: {
    method: "get",
    path: "/api/auth/user",
  },
  tokenUpdate: {
    method: "patch",
    path: "/api/auth/user",
  },
  netCheck: {
    method: "get",
    path: "/api/auth/netcheck",
  },
  profile: {
    method: "get",
    path: "/api/user",
  },
  profileUpdate: {
    method: "put",
    path: "/api/user",
  },
  patchToken: {
    method: "patch",
    path: "/api/auth/user",
  },
  befriend: {
    method: "post",
    path: "/api/user/friends/$id",
  },
  unfriend: {
    method: "delete",
    path: "/api/user/friends/$id",
  },
  identify: {
    method: "post",
    path: "/api/user/id",
  },
  wallet: {
    method: "get",
    path: "/api/user/wallet",
  },
  wallets: {
    method: "get",
    path: "/api/user/walletlist",
  },
  walletHistory: {
    method: "get",
    path: "/api/user/wallethistory",
  },
  factionWalletHistory: {
    method: "get",
    path: "/api/factions/$faction/wallethistory",
  },
  pay: {
    method: "put",
    path: "/api/user/wallet",
  },
  factionPay: {
    method: "put",
    path: "/api/factions/$faction/wallet",
  },
  request: {
    method: "put",
    path: "/api/user/$id/walletrequest",
  },
  factionRequest: {
    method: "put",
    path: "/api/factions/$faction/$id/walletrequest",
  },
  contacts: {
    method: "get",
    path: "/api/user/friends",
  },
  channels: {
    method: "get",
    path: "/api/chat/channels",
  },
  channelUsers: {
    method: "get",
    path: "/api/chat/channels/$id/users",
  },
  channelCreate: {
    method: "post",
    path: "/api/chat/channels",
  },
  channelInvite: {
    method: "put",
    path: "/api/chat/channels/$channel/invites/$id",
  },
  channelJoin: {
    method: "put",
    path: "/api/chat/channels/$channel",
  },
  channelScope: {
    method: "put",
    path: "/api/chat/public/$channel",
  },
  channelLeave: {
    method: "delete",
    path: "/api/chat/channels/$channel/$id",
  },
  channelAdmin: {
    method: "put",
    path: "/api/chat/channels/$channel/$id",
  },
  chatHistory: {
    method: "get",
    path: "/api/chat/channels/$id/history",
  },
  message: {
    method: "post",
    path: "/api/chat/channels/$id",
  },
  pollMessages: {
    method: "get",
    path: "/api/chat/channels/all/?since=$since",
  },
  factionsList: {
    method: "get",
    path: "/api/factions/all",
  },
  factions: {
    method: "get",
    path: "/api/user/factions",
  },
  factionProfile: {
    method: "get",
    path: "/api/factions/$id",
  },
  factionProfileUpdate: {
    method: "patch",
    path: "/api/factions/$id",
  },
  factionInvite: {
    method: "put",
    path: "/api/factions/$faction/invite/$id",
  },
  factionJoin: {
    method: "put",
    path: "/api/factions/$faction",
  },
  factionLeave: {
    method: "delete",
    path: "/api/factions/$faction/$id",
  },
  factionAddRep: {
    method: "put",
    path: "/api/factions/$faction/reps/$id",
  },
  factionRemoveRep: {
    method: "delete",
    path: "/api/factions/$faction/reps/$id",
  },
  factionUpdateProfile: {
    method: "patch",
    path: "/api/factions/$faction",
  },
  factionStatuses: {
    method: "get",
    path: "/api/factions/$faction/statuses/$id",
  },
  factionSetStatus: {
    method: "post",
    path: "/api/factions/$faction/statuses/$id",
  },
  statuses: {
    method: "get",
    path: "/api/user/statuses/$id",
  },
  statusSet: {
    method: "post",
    path: "/api/user/statuses/$id",
  },
  hiddenStatusSet: {
    method: "post",
    path: "/api/user/statuses/$id/hidden",
  },
  factionHiddenStatusSet: {
    method: "post",
    path: "/api/factions/$faction/statuses/$id/hidden",
  },
  statusesSet: {
    method: "get",
    path: "/api/user/setstatuses",
  },
  statusRemove: {
    method: "delete",
    path: "/api/user/statuses/$id",
  },
  factionStatusRemove: {
    method: "delete",
    path: "/api/factions/$faction/statuses/$id",
  },
  toggleStatusScope: {
    method: "put",
    path: "/api/user/statuses/$id",
  },
  toggleFactionStatusScope: {
    method: "put",
    path: "/api/factions/$faction/statuses/$id",
  },
  searchUsers: {
    method: "post",
    path: "/api/user/search",
  },
};

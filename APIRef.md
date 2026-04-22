# NeoNav API Reference

![neonav-api-logo-small](https://user-images.githubusercontent.com/4284104/93136217-66e18280-f690-11ea-869b-b219306e3a5f.png)

This is the backend Node.js server for the NeoNav Client.

### Primary Functions
  - Serve data from database
  - Verify user credentials
  - Log activity

### API Reference

#### Hyperlinks
###### Auth
| API | Method | URI |
| ------ | ------ | ------ |
| Login | `POST` | [/api/auth](#Login) |
| Verify User| `GET` | [/api/auth/user](#VerifyUser) |
| Token Update | `PATCH` | [/api/auth/user](#TokenUpdate) |

###### User
| API | Method | URI |
| ------ | ------ | ------ |
| Profile | `GET` | [/api/user](#Profile) |
| Update | `PUT` | [/api/user](#Update) |
| Friendslist | `GET` | [/api/user/friends](#Friendslist) |
| Friend | `POST` | [/api/user/friends/:newfriend](#Friend) |
| View Friend | `GET` | [/api/user/friends/:friend](#ViewFriend) |
| Unfriend | `DELETE` | [/api/user/friends/:ex-friend](#Unfriend) |
| Identify | `POST` | [/api/user/id](#Identify) |
| Set Status | `POST` | [/api/user/statuses/:user](#SetStatus) |
| Set Hidden Status | `POST` | [/api/user/statuses/:user/hidden](#SetHiddenStatus) |
| Get Statuses | `GET` | [/api/user/statuses/:user](#GetStatuses) |
| Get Set Statuses | `GET` | [/api/user/setstatuses/:user](#GetSetStatuses) |
| Toggle Status Class | `PUT` | [/api/user/statuses/:status](#ToggleStatusClass) |
| Delete Status | `DELETE` | [/api/user/statuses/:status](#DeleteStatus) |
| Search Users | `POST` | [/api/user/search](#UserSearch) |

###### Wallet
| API | Method | URI |
| ------ | ------ | ------ |
| WalletList | `GET` | [/api/user/walletlist](#WalletList) |
| Wallet | `GET` | [/api/user/wallet/:wallet](#Wallet) |
| Wallet Send | `PUT` | [/api/user/wallet](#WalletSend) |
| Faction Wallet Send | `PUT` | [/api/factions/:faction/wallet](#FactionWalletSend) |
| Wallet History | `GET` | [/api/user/wallethistory](#WalletHistory) |
| Faction Wallet History | `GET` | [/api/factions/:faction/wallethistory](#WalletHistory) |
| Wallet Request | `PUT` | [/api/user/:user/walletrequest](#WalletRequest) |
| Faction Wallet Request | `PUT` | [/api/factions/:faction/:user/walletrequest](#FactionWalletRequest) |

###### Chat / Channels
| API | Method | URI |
| ------ | ------ | ------ |
| Create Channel | `POST` | [/api/chat/channels](#ChannelCreate) |
| Public/Group | `PUT` | [/api/chat/public/:channel](#ChannelPubSwap) |
| Channels | `GET` | [/api/chat/channels](#Channels) |
| Invited Channels | `GET` | [/api/chat/channels/invited](#InvitedChannels) |
| Public Channels | `GET` | [/api/chat/channels/public](#PubChannels) |
| Admin Channels | `GET` | [/api/chat/channels/admin](#AdminChannels) |
| Latest Messages | `GET` | [/api/chat/channels/latest](#ChannelsLatest) |
| Users | `GET` | [/api/chat/channels/:channel/users](#ChannelUsers) |
| Invites | `GET` | [/api/chat/channels/:channel/invites](#ChannelInvites) |
| Invite User | `PUT` | [/api/chat/channels/:channel/invites/:user](#ChannelInvite) |
| Join Channel | `PUT` | [/api/chat/channels/:channel](#ChannelJoin) |
| Remove User | `DELETE` | [/api/chat/channels/:channel/:user](#ChannelLeave) |
| Ban/Unban User | `DELETE` | [/api/chat/channels/:channel/:user/:ban](#ChannelBan) |
| Ban List | `GET` | [/api/chat/channels/:channel/banlist](#ChannelBanList) |
| Change Admin | `PUT` | [/api/chat/channels/:channel](#ChannelAdmin) |
| History | `GET` | [/api/chat/channels/:channel/history](#ChannelHistory) |
| Feed | `GET` | [/api/chat/channels/:channel](#ChannelFeed) |
| Post | `POST` | [/api/chat/channels/:channel](#ChannelPost) |
| Delete | `DELETE` | [/api/chat/messages/:channel/:message](#MessageDelete) |

###### Factions
| API | Method | URI |
| ------ | ------ | ------ |
| List All Factions | `GET` | [/api/factions/all](#FactionsList) |
| List User Factions | `GET` | [/api/user/:user/factions](#UserFactions) |
| Invite User | `PUT` | [/api/factions/:faction/invite/:user](#FactionInvite) |
| Join Faction | `PUT` | [/api/factions/:faction](#FactionJoin) |
| Leave Faction | `DELETE` | [/api/factions/:faction/:user](#FactionLeave) |
| Promote Member | `PUT` | [/api/factions/:faction/reps/:user](#FactionAddRep) |
| Demote Rep | `DELETE` | [/api/factions/:faction/reps/:user](#FactionRemoveRep) |
| Faction Profile | `GET` | [/api/factions/:faction](#FactionProfile) |
| Update Profile| `PATCH` | [/api/factions/:faction](#UpdateFactionProfile) |
| Set Status | `POST` | [/api/factions/:faction/statuses/:user](#SetStatus) |
| Set Hidden Status | `POST` | [/api/factions/:faction/statuses/:user/hidden](#SetHiddenStatus) |
| Get Statuses | `GET` | [/api/factions/:faction/statuses/:user](#GetStatuses) |
| Get Set Statuses | `GET` | [/api/factions/:faction/setstatuses/:user](#GetSetStatuses) |
| Toggle Status Class | `PUT` | [/api/factions/:faction/statuses/:status](#ToggleStatusClass) |
| Delete Status | `DELETE` | [/api/factions/:faction/statuses/:status](#DeleteStatus) |

###### Locations
| API | Method | URI |
| ------ | ------ | ------ |
| Create Location | `POST` | [/api/locations](#LocationCreate) |
| Create Faction Location | `POST` | [/api/factions/:faction/locations](#FactionLocationCreate) |
| Update Location | `PATCH` | [/api/locations/:location](#LocationUpdate) |
| Update Faction Location | `PATCH` | [/api/factions/:faction/locations/:location](#FactionLocationUpdate) |
| List All Locations | `GET` | [/api/locations/all](#LocationsList) |
| Get Location Info | `GET` | [/api/locations/:location](#LocationGet) |
| Review Location | `POST` | [/api/locations/:location/reviews](#LocationReview) |
| Delete Location | `DELETE` | [/api/locations/:location](#LocationDelete) |
| Delete Location Review | `DELETE` | [/api/locations/review/:review](#LocationDeleteReview) |
| Set Location Lat/Long | `POST` | [/api/locations/:location/gps](#LocationGPS) |
| Verify Location | `PATCH` | [/api/locations/:location/verify](#LocationVerify) |
| Create Location Event | `POST` | [/api/locations/:location/events](#LocationAddEvent) |
| List Location Events | `GET` | [/api/locations/:location/events](#LocationGetEvents) |
| List Attending Events | `GET` | [/api/user/events](#GetAttendingEvents) |
| List Remaining Events | `GET` | [/api/locations/events](#GetRemainingEvents) |
| List All Events | `GET` | [/api/locations/events/all](#GetAllEvents) |
| List My Events | `GET` | [/api/user/events/mine](#GetUserEvents) |
| Update Event | `PUT` | [/api/locations/events/:event](#LocationUpdateEvent) |
| Toggle Attendance | `PATCH` | [/api/locations/events/:event](#EventResponse) |
| Drop Location Pin | `POST` | [/api/locations/pins](#AddLocationPin) |
| List Location Pins | `GET` | [/api/locations/pins/:user](#ListLocationPins) |
| List All Location Pins | `GET` | [/api/locations/pins/all](#ListAllLocationPins) |
| Delete Location Pins | `DELETE` | [/api/locations/pins](#DeleteLocationPins) |

###### Images
| API | Method | URI |
| ------ | ------ | ------ |
| Get Image | `GET` | [/api/image/:userid](#FetchImage) |
| Get Thumbnail | `GET` | [/api/image/:userid/thumbnail](#FetchThumbnail) |
| Update User Image | `PUT` | [/api/image](#UpdateImage) |
| Update Faction Image | `PUT` | [/api/image/faction/:faction](#UpdateFactionImage) |

###### API Keys
| API | Method | URI |
| ------ | ------ | ------ |
| Create API Key | `GET` | [/api/auth/apikey](#CreateKey) |
| Create Faction API Key | `GET` | [/api/factions/:faction/apikey](#CreateFactionKey) |
| List API Keys | `GET` | [/api/auth/apikey/list](#ListKeys) |
| Delete API Key | `DELETE` | [/api/auth/apikey](#DeleteKey) |

------

### Auth API
#### Login
##### POST /api/auth
Takes either the email or userid associated with a user, matches it to the password, and returns an accessToken.

If the user has never edited their profile, a notification will be sent 5 seconds after login telling them to do so, and suggesting they read the Help.
###### Input
```sh
POST /api/auth HTTP/1.1
content-type: application/json
{
    "username": either email or userid,
    "password": plaintext password
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "id": database id,
  "userid": userid,
  "accessToken": access token string
}
```
------
#### VerifyUser
##### GET /api/auth/user
Takes a user accessToken and verifies its signature, and checks that the user is still an active user.
###### Input
```sh
GET /api/auth/user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "User verified."
}
```
-----
#### TokenUpdate
##### PATCH /api/auth/user
Takes an existing accessToken and updates it with information from the database, such as a recently changed username. This method will **not** change the expiry time of the accessToken.
###### Input
```sh
PATCH /api/auth/user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "accessToken": new access token string
}
```
------

### User API
#### Profile
##### GET /api/user
Verifies user token with extended verification and returns a json object containing the entire user database document.
Please be aware that the return object could contain Unicode characters from any language.
Please also be aware that it's impossible to update the user profile without the returned "_rev" value. This value ensures you can not overwrite newer data.
###### Input
```sh
GET /api/user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "_id": user database id,
  "_rev": user database reivision,
  "auth": {
    "userid": userid,
    "email": user email,
    "emailverified": true or false
  },
  "profile": {
    "username": username for display in public,
    "firstname": first name,
    "lastname": last name
  }
}
```
------
#### Update
##### PUT /api/user
Verifies user token and takes a user profile document like the one output from GET /api/user and updates the database with it.
Note that only the "profile" object will be updated. **It is not possible to update passwords, emails, or other auth data with this method, and attempting to do so will throw a security log.** The returned profile object will have the correct new revision number from the database and can be acted on immediately and passed again to the update profile method if needed. If the profile object contains a variable named "avatar", it must be a base64-encoded image. A thumbnail at 150x150px will automatically be generated and added as "thumbnail" to the profile object.
Please be aware that the return object could contain Unicode characters from any language.

Each time this method is called, a field called "updated" is updated with the latest timestamp in the user document. This is included in the access token on login. If the user has never updated their profile, it is set to false.
###### Input
```sh
PUT /api/user HTTP/1.1
content-type: application/json
x-access-token: access token string
 
{
  "_id": dbid,
  "_rev": dbrev,
  "profile": {
    "username": username for public display,
    "firstname": firstname,
    "lastname": lastname
  }
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "_id": dbid,
  "_rev": new rev,
  "auth": {
    "userid": userid,
    "email": email,
    "emailverified": true
  },
  "profile": {
    "username": username,
    "firstname": first name,
    "lastname": last name
  },
  "updated": false / timestamp
}
```
------
#### Friendslist
##### GET /api/user/friends
Verifies user token and returns an array of people user has "followed", each one being an object with a userid, and a username if it has been set in their profile. If the user has set a status, it will also be returned.
Please be aware that the return array could contain Unicode characters from any language.
###### Input
```sh
GET /api/user/friends HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": userid,
    "username": username for display in public,
    "thumbnail": avatar thumbnail, if one is set
  },
  {
    "id": userid
  }
]
```
------
#### Friend
##### POST /api/user/friends/:newfriend
_:newfriend in URI is ten digit numerical userid of the person to "follow"_
Adds a new friend to the user's friendslist.
###### Input
```sh
POST /api/user/friends/:newfriend HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Followed :newfriend"
}
```
------
#### ViewFriend
##### GET /api/user/friends/:friend
_:friend in URI is ten digit numerical userid of the person to "follow"_

This function will be deprecated in the next release. Please use [/api/user/id](#Identify) to view information about a user, faction, product, location, or chat channel.

Views a friend's profile. This function will return the entire profile object of a user document. It can be called for any :friend listed in [/api/user/friends](#Friendslist), as well as the users own profile.
Please be aware that the return object could contain Unicode characters from any language, as well as images.
###### Input
```sh
GET /api/user/friends/:friend HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "auth": {
    "userid": friend's userid
  },
  "profile": {
  "username": username, if there is one
  "firstname": firstname, if there is one
  "lastname": lastname, if there is one
  "occupation": occupation, if there is one
  "avatar": data:image/jpeg;base64, if one has been set
  }
}
```
------
#### Unfriend
##### DELETE /api/user/friends/:ex-friend
_:ex-friend in URI is ten digit numerical userid of the person to "unfollow"_
Deletes an ex-friend from the user's friendslist.
###### Input
```sh
DELETE /api/user/friends/:ex-friend HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Unfollowed."
}
```
------
#### Identify
##### POST /api/user/id
Verifies user token and searches for a target with a supplied ID number. The post object must be named "requestId" and contain a valid 10 digit alphanumeric ID number or 32 character channel id. The function will gracefully display errors if other data is sent.
Please be aware that the return object could contain Unicode characters from any language as well as images. A successfully retrieved profile will result in a 200 code, followed by a JSON object containing the found data. In the unlikely event that a user is found, but that user has no profile in the database, a 204 code will be sent. A malformed ID sent to the backend will return a 400 code, and a correct ID for which there is no data associated at all will send a 404 code. An existing user who has never updated their profile will also send a 404 code and a message mentioning that fact.
This function can also be used to fetch data about Factions, Locations, Products, and Chat Channels.
Please note that the output structure has changed since 1.7.
###### Input
```sh
POST /api/user/id HTTP/1.1
content-type: application/json
x-access-token: access token string
{"requestId": scanned or clicked ID string, should be 10 digit alphanumeric ID string}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "type": type,
  "id": ID number,
  "type": "user" (or "faction", or "location", or "product"),
  "name": name, if there is one, otherwise a repeat of "id",
  "description": for users, this will be the profile.bio,
  "image": data:image/jpeg;base64, if one has been set,
  "meta": { this section may contain various interesting variables with descriptive names, such as "firstname", "skills", etc. which should all be displayed
    "owner": if set, this will be an ID number that could be identified for more information,
    "ownername": name associated with the above ID number
    "reps": [factions may return an array of ID numbers of users who are reps of that faction]
  }
}
```
```sh
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
{
  "message": "Citizen with ID 1179118740 not found."
}
```
------
#### SetStatus
##### POST /api/user/statuses/:user
OR
##### POST /api/factions/:faction/statuses/:user
_:user in URI is a 10-digit ID of a valid user target, defaults to your own if omitted_
Verifies user token, posts the status, then returns a code.
###### Input
```sh
POST /api/user/statuses/:user HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "body": status body
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Status set."
}
```
------
#### SetHiddenStatus
##### POST /api/user/statuses/:user/hidden
OR
##### POST /api/factions/:faction/statuses/:user/hidden
_:user in URI is a 10-digit ID of a valid user target_
Verifies user token, posts a hidden status, then returns a code. Target must be valid user id, and can't be self.
Hidden statuses can't be seen by the target.
###### Input
```sh
POST /api/user/statuses/hidden/:user HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "body": status body
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Status set."
}
```
------
#### GetStatuses
##### GET /api/user/statuses/:user
OR
##### GET /api/factions/:faction/statuses/:user
_:user in URI is a 10-digit ID of a valid user target, defaults to your own if omitted_
Verifies user token, returns an array of all non-hidden statuses applied to user if :user is omitted or matches userid. If :user is someone else, it will return all public statuses set for that person. This will return an empty array if the user has no statuses set, or if the user does not exist.

Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/user/statuses HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": dbid of status,
    "class": public, private, or hidden,
    "sender": sender id,
    "ts": timestamp,
    "from": username of sender at the time the status was set,
    "body": status text body
  },
  {
    "id": dbid of status,
    "class": public, private, or hidden,
    "sender": sender id,
    "ts": timestamp,
    "from": username of sender at the time the status was set,
    "body": status text body,
    "target": target userid if one exists
  },
]
```
------
#### GetSetStatuses
##### GET /api/user/setstatuses/:user
OR
##### GET /api/factions/:faction/setstatuses/:user
:user in URI is a 10-digit ID of a valid user target, defaults to “all” if omitted
Verifies user token, returns an array of all statuses applied by user. If a userid is provided, it will filter results to only statuses applied to that particular target. This will return an empty array if the user has no statuses set, or if the user does not exist.

Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/user/setstatuses/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": dbid of status,
    "class": public, private, or hidden,
    "sender": sender id,
    "ts": timestamp,
    "from": username of sender at the time the status was set,
    "body": status text body
  },
  {
    "id": dbid of status,
    "class": public, private, or hidden,
    "sender": sender id,
    "ts": timestamp,
    "from": username of sender at the time the status was set,
    "body": status text body,
    "target": target userid if one exists
  },
]
```
------
#### ToggleStatusClass
##### PUT /api/user/statuses/:status
OR
##### PUT /api/factions/:faction/statuses/:status
_:status in URI is an id string of the status as returned in the [User API](#GetStatuses)_
Verifies user token, verifies permission, and toggles status class between private and public.
###### Input
```sh
PUT /api/user/statuses/:status HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Status set to private."
}
```
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Status set to public."
}
```
------
#### DeleteStatus
##### DELETE /api/user/statuses/:status
OR
##### DELETE /api/factions/:faction/statuses/:status
_:status in URI is an id string of the status as returned in the [User API](#GetStatuses)_
Verifies user token, verifies permission, and revokes the status if it exists.
User can revoke any status that is private or public if they are the target.
User can revoke any status that is private, public, or hidden, if they are the sender.
###### Input
```sh
DELETE /api/user/statuses/:status HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Status deleted."
}
```
------
#### UserSearch
##### POST /api/user/search
Verifies user token, and searches all usernames in the database for the provided query string and returns an array of matching users.
It will not return results for misspelled words. "Sea" will return matches for "Search" and "CheeseSea" but not "See".
###### Input
```sh
POST /api/user/search HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "query": Search String
}

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "userid": user id,
    "username": a matching username
  },
    {
    "userid": user id,
    "username": another matching username
  }
]

```
------

### Wallet API
#### WalletList
##### GET /api/user/walletlist
Verifies user token with extended verification and returns an array containing a list of wallets the user has access to.
Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/user/walletlist HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": userid,
    "balance": int amount of c±sн available,
    "type": "personal"
  },
  {
    "id": faction id, //user is admin or rep of this faction
    "name": faction name,
    "balance": int amount of c±sн available,
    "type": "faction"
  }
  {
    "id": other faction id, //user is admin or rep of this faction too
    "name": other faction name,
    "balance": int amount of c±sн available,
    "type": "faction"
  }
]
```
------
#### Wallet
##### GET /api/user/wallet/:wallet
_:wallet in URI is an id string of the wallet as returned in the [Wallet List API](#WalletList) (optional if self)_
This function has been deprecated and will return a 403.
###### Input
```sh
GET /api/user/wallet/:wallet HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
{
  "message": "Deprecated endpoint. Please use Wallet List."
}
```
------
#### WalletSend
##### PUT /api/user/wallet
Verifies user token and sends money from the user to a recipient. Recipient can be a personal wallet or a faction wallet. This updates both wallets and creates a transaction for [/api/user/wallethistory](#WalletHistory).
This method will return a 403 if the user tries to send 0 or fractional amounts, or more money than they have in their wallet.
###### Input
```sh
PUT /api/user/wallet HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "recipient": recipient ID,
  "amount": transaction amount
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Wallets updated for sender ID and recipient ID."
}
```
------
#### FactionWalletSend
##### PUT /api/factions/:faction/wallet
Verifies user token and rep or admin status in :faction. Then sends money from the faction to a recipient. Recipient can be a personal wallet or a faction wallet. This updates both wallets and creates a transaction the appropriate wallet histories.
This method will return a 403 if the user tries to send 0 or fractional amounts, or more money than is in the wallet.
###### Input
```sh
PUT /api/factions/:faction/wallet HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "recipient": recipient ID,
  "amount": transaction amount
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Wallets updated for faction ID and recipient ID."
}
```
------
#### WalletHistory
##### GET /api/user/wallethistory ? \[limit=number of results (100 default)\] \[offset=number of results to skip\]
OR
##### GET /api/factions/:faction/wallethistory
_:faction in URI is an id string of a faction as returned in the [Wallet List API](#WalletList)_
Verifies user token and returns an array of wallet transactions for the relevant wallet. They contain a timestamp, an amount (which will be negative for sent credits and positive for received credits, and a userid referencing the other party to the transaction.
Passing "limit" will override the default of 100 results, and is optional. If you want an earlier set of results, you can optionally pass "offset=" in the URL.
Please be aware that the return array could contain Unicode characters from any language.
###### Input
```sh
GET /api/user/wallethistory HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Input
```sh
GET /api/factions/:faction/wallethistory HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "ts": timestamp,
    "amount": transaction amount,
    "user": userid of source or recipient,
    "username": username of source or recipient, or userid again they have not set one
  },
  {
    "ts": timestamp of second transaction,
    "amount": transaction amount,
    "user": userid of source or recipient,
    "username": username of source or recipient, or userid again they have not set one
  }
]
```
------
#### WalletRequest
##### PUT /api/user/:user/walletrequest
OR
##### PUT /api/user/:user/walletrequest/:amount
_:user in URI is an id string of a user or faction. :amount can be passed as a URI param or in the request payload._
Verifies user token and sends a notification to :user asking them to send an amount of money specified in the request.
###### Input
```sh
PUT /api/user/:user/walletrequest HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "amount": transaction amount
}
```
```sh
PUT /api/user/:user/walletrequest/:amount HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Request sent."
}
```
------
#### FactionWalletRequest
##### PUT /api/factions/:faction/:user/walletrequest
_:faction in URI is a 10-character ID of a valid faction_

_:user in URI is an id string of the user or faction to request money from_

Verifies user token and rep or admin status in :faction. Sends a notification to :user asking them to send an amount of money to the faction wallet.
###### Input
```sh
PUT /api/factions/:faction/:user/walletrequest HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "amount": transaction amount
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Request sent."
}
```
------
#### FactionWalletRequest
##### PUT /api/factions/:faction/:user/walletrequest
_:faction in URI is a 10-character ID of a valid faction_

_:user in URI is an id string of the user or faction to request money from_

Verifies user token and rep or admin status in :faction. Sends a notification to :user asking them to send an amount of money to the faction wallet.
###### Input
```sh
PUT /api/factions/:faction/:user/walletrequest HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "amount": transaction amount
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Request sent."
}
```
------

### Chat API
#### ChannelCreate
##### POST /api/chat/channels

Verifies user token and creates channel with user as admin and only member. Channel created will have the name specified in POST payload prefixed by "谈." automatically. If the name is currently used, this will return a 403.

###### Input
```sh
POST /api/chat/channels HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "name": channel name (unicode allowed)
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "message": "Channel created."
}
```
------
#### ChannelPubSwap
##### PUT /api/chat/public/:channel
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

Verifies user token and admin status on channel and then changes the scope of the channel from group to public, or vice versa.

###### Input
```sh
PUT /api/chat/public/:channel HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Channel channelname was changed from public to group."
}
```
------
#### Channels
##### GET /api/chat/channels
Verifies user token and returns an array of json objects containing the channels that user has read or write access to.
Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/chat/channels HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": "22c6fec7b63257ca0d7b74394605813e",
    "name": "谈.global",
    "scope": "global"
  },
  {
    "id": "22c6fec7b63257ca0d7b743946090fa9",
    "name": "谈.announce",
    "scope": "announce"
  },
  {
    "id": "22c6fec7b63257ca0d7b74394606009f",
    "name": "谈.wcc",
    "scope": "group",
    "admin": admin userid
  }
]
```
------
#### PubChannels
##### GET /api/chat/channels/public
Verifies user token and returns an array of json objects containing all public channels. If there are none, this will return an empty array.
Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/chat/channels/public HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": "d6993467030d7398f0415badd9157253",
    "name": "谈.api",
    "scope": "public",
    "admin": admin userid,
    "members": 20
  },
  {
    "id": "d6993467030d7398f0415badd925ea89",
    "name": "谈.help",
    "scope": "public",
    "admin": admin userid,
    "members": 33
  },
  {
    "id": "d6993467030d7398f0415badd941eeb5",
    "name": "谈.NPR",
    "scope": "public",
    "admin": admin userid,
    "members": 3
  }
]
```
------
#### InvitedChannels
##### GET /api/chat/channels/invited
Verifies user token and returns an array of json objects containing the channels that user has been invited to but not yet joined. If the user has no pending invites, this will return an empty array.
Please be aware that the return object could contain Unicode characters from any language. The user can [accept](#ChannelJoin) or [decline](#ChannelLeave) this invitation.
###### Input
```sh
GET /api/chat/channels/invited HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": "22c6fec7b63257ca0d7b74394606009f",
    "name": "谈.wcc",
    "scope": "group",
    "admin": admin userid
  }
]
```
------
#### AdminChannels
##### GET /api/chat/channels/admin
Verifies user token and returns an array of json objects containing the channels that user is admin of.
Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/chat/channels/admin HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": "22c6fec7b63257ca0d7b74394606009f",
    "name": "谈.wcc",
    "scope": "group",
    "admin": admin userid
  }
]
```
------
#### ChannelsLatest
##### GET /api/chat/channels/latest
Verifies user token and returns an array of json objects, each containing the latest message in every channel the user has access to. This is intended to be used to check whether the client already has the latest message for each channel, or whether new messages need to be fetched via [Channel History](#ChannelHistory). Channels with no messages are omitted. Returns an empty array if the user has no channels.
Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/chat/channels/latest HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": unique message id,
    "ts": timestamp,
    "channel": channel id,
    "channelName": channel name,
    "fromid": userid,
    "from": username or userid at time of message,
    "text": message body
  }
]
```
------
#### ChannelInvite
##### PUT /api/chat/channels/:channel/invites/:user
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_:user in URI is a 10-digit ID of a valid user to be invited_

Verifies user token and that the user is an admin of the channel, which must have scope "group". It will then notify the user specified in the URI that they have been invited.
The user can [accept](#ChannelJoin) or [decline](#ChannelLeave) this invitation.

Will not work for channels with "global" or "announce" scopes.
###### Input
```sh
PUT /api/chat/channels/:channel/invites/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "message": "User invited to channel."
}
```
------
#### ChannelJoin
##### PUT /api/chat/channels/:channel
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

Verifies user token. If the channel scope is "group", it then verifies that user has been invited to the selected channel via the [Channels API](#ChannelInvite). If channel scope is "public", user must not be in channel already. It then updates channel membership to include the user.

Will not work for channels with "global" or "announce" scopes.
###### Input
```sh
PUT /api/chat/channels/:channel HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User joined channel."
}
```
------
#### ChannelLeave
##### DELETE /api/chat/channels/:channel/:user
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_:user in URI is an id string of the user to be removed_

If the user is invited to the channel but has not yet joined, the invitation will be declined. Otherwise, this verifies user token and that user is an admin on the selected channel, or that the user is the user to be deleted, then updates channel membership to delete user specified with :user. If the user making the request is the admin of the channel, the leave will fail unless that person is alone in the channel.

Will not work for channels with "global" or "announce" scopes.
###### Input
```sh
DELETE /api/chat/channels/:channel/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User removed from channel."
}
```
------
#### ChannelBan
##### DELETE /api/chat/channels/:channel/:user/:ban
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_:user in URI is a 10-digit ID of the user to ban or unban_

_:ban must be either `ban` or `unban`_

Verifies user token and admin status on :channel, then bans or unbans the specified user. Only works on public channels — will return a 403 for group, announce, or notify channels. When banning, the user is also removed from the channel's member and invite lists.
###### Input
```sh
DELETE /api/chat/channels/:channel/:user/:ban HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User banned from channel."
}
```
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User unbanned from channel."
}
```
------
#### ChannelBanList
##### GET /api/chat/channels/:channel/banlist
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

Verifies user token and admin status on :channel, and returns an array of userids on the ban list. Always returns an empty array for group, announce, and notify channels.
###### Input
```sh
GET /api/chat/channels/:channel/banlist HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  userid,
  userid
]
```
------
#### ChannelUsers
##### GET /api/chat/channels/:channel/users
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_
Verifies user token and returns an array of json objects containing the users which have read or write access to :channel.
Please be aware that the return object could contain Unicode characters from any language.

Will always return an empty array for channels with "global" or "announce" scopes.
###### Input
```sh
GET /api/chat/channels/:channel/users HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "userid": userid,
    "username": username
  },
  {
    "userid": userid //this user has no username
  }
]
```
------
#### ChannelInvites
##### GET /api/chat/channels/:channel/invites
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_
Verifies user token and admin status, and returns an array of json objects containing the users which have been invited to join :channel.
Please be aware that the return object could contain Unicode characters from any language.

Will always return an empty array for channels with "global" or "announce" scopes.
###### Input
```sh
GET /api/chat/channels/:channel/invites HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "userid": userid,
    "username": username
  },
  {
    "userid": userid //this user has no username
  }
]
```
------
#### ChannelAdmin
##### PUT /api/chat/channels/:channel/:user
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_:user in URI is an id string of the new admin_

Verifies user token and admin status on :channel, and then changes that channel's admin to the specified new admin user specified by :user.

###### Input
```sh
PUT /api/chat/channels/:channel/:user HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "New channel admin assigned."
}
```
------
#### ChannelHistory
##### GET /api/chat/channels/:channel/history ? \[since=timestamp\] \[until=timestamp\] \[limit=number of messages\]
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_since timestamp must be earlier in time than until timestamp, but both are optional_

_if limit is not passed, the default set in /config/db.config.js (20) will be used_

Verifies user token and returns an array of json objects containing the message history of :channel, sorted from newest to oldest.
Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/chat/channels/:channel/history HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": unique message id,
    "ts": timestamp,
    "channel": channel id,
    "fromid": userid,
    "from": username or userid at time of message,
    "text": message body
  },
  {
    "id": different unique message id,
    "ts": different timestamp,
    "channel": channel id,
    "fromid": userid,
    "from": username or userid at time of message,
    "text": message body
  }
]
```
------
#### ChannelFeed
##### GET /api/chat/channels/:channel ? \[since=sequence id\]
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_If **all** is passed as the id string, all channels the user has read access to will be included in the feed_

_since IS NOT A TIMESTAMP, it is a sequence id returned by each poll response_

Verifies user token and leaves an open HTTP connection until a message is produced in :channel, then returns an Array containing a new sequence ID (for use in ?since=) and then a JSON object of all messages produced, and closes the connection. The return is an Array to protect from the off chance that more than one message arrives simultaneously. This should be incredibly rare.

There is a timeout set in db.config, after which, if no message has been produced, the connection will return and close. The return array will contain only the sequence ID, which should be identical to the last sequence ID if there have been no new messages.

Please be aware that the return object could contain Unicode characters from any language.
###### Input
```sh
GET /api/chat/channels/:channel HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  "471-g1AAAACeeJzLYWBgYMpgTmEQTM4vTc5ISXIwNDLXMwBCwxyQVCJDUv3___-zMpgTV-UCBdgtjZNSzdOSsGnAY0weC5BkaABS_yGmJTEwMOqCDUwxTTJOMkrGpjULAPWcKbY", //example sequence id
  {
    "id": unique message id,
    "ts": timestamp,
    "channel": channel id (mainly useful when using "all" as the channel),
    "fromid": userid,
    "from": username or userid at time of message,
    "text": message body
  }
]
```
------
#### ChannelPost
##### POST /api/chat/channels/:channel
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_
Verifies user token and write permission on channel and then posts the message to the channel, then returns a code.
###### Input
```sh
POST /api/chat/channels/:channel HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "text": message body
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Message posted."
}
```
------
#### MessageDelete
##### DELETE /api/chat/messages/:channel/:message
_:channel in URI is an id string of the channel as returned in the [Channels API](#Channels)_

_:message in URI is an id string of the message as returned in the [Channel History API](#ChannelHistory) or [Channel Feed API](#ChannelFeed)_

Verifies user token and admin status on channel and then redacts the text of the message, then returns a code. Please note that the original message body is preserved in the database. This API merely sets doc.redacted = true, which causes the message body to appear as "\[REDACTED\]" when accessed through any database view other than chat/redacted-messages.
###### Input
```sh
DELETE /api/chat/messages/:channel/:message HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Message redacted."
}
```
------
### Faction API
#### FactionsList
##### GET /api/factions/all
Verifies user token and returns an array with a list of all active factions. Factions with no users will not be listed.

###### Input
```sh
GET /api/factions/all HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": faction id,
    "admin": userid of faction administrator,
    "name": name of faction,
    "members": number of faction members
  },
  {
    "id": other faction id,
    "admin": userid of faction administrator,
    "name": name of faction,
    "members": number of faction members,
    "thumbnail": base-64 encoded 150x150px thumbnail of faction logo
  }
]
```
------
#### UserFactions
##### GET /api/user/:user/factions
OR
##### GET /api/factions
_:user in URI is a 10-digit ID of a valid user. If omitted, defaults to self._
Verifies user token and returns an array with a list of all factions :user belongs to.

###### Input
```sh
GET /api/user/:user/factions HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": faction id,
    "admin": userid of faction administrator,
    "name": name of faction,
    "reps": [
      array of userids of faction representatives
    ]
  },
  {
    "id": other faction id,
    "admin": userid of faction administrator,
    "name": name of faction,
        "reps": [
      array of userids of faction representatives
    ],
    "thumbnail": base-64 encoded 150x150px thumbnail of faction logo
  }
]
```
------
#### FactionInvite
##### PUT /api/factions/:faction/invite/:user
_:user in URI is a 10-digit ID of a valid user_
_:faction in URI is a 10-character ID of a valid faction_
Verifies user token and that user is an admin or representative of :faction. Checks that :user exists and invites them to the faction, then sends a notification to the faction admin and :user.

###### Input
```sh
PUT /api/factions/:faction/invite/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "User invited to faction."
}
```
------
#### FactionJoin
##### PUT /api/factions/:faction
_:faction in URI is a 10-character ID of a valid faction_
Verifies user token and that user has a pending invite to :faction. Adds user to the faction, then sends a notification to the faction admin and :user.

###### Input
```sh
PUT /api/factions/:faction HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Welcome to faction name."
}
```
------
#### FactionLeave
##### DELETE /api/factions/:faction/:user
_:user in URI is a 10-digit ID of a valid user (optional if self)_ 
_:faction in URI is a 10-character ID of a valid faction_
Verifies user token and that user is either an admin or rep of :faction if :user is provided. If :user is omitted, it is assumed that user is leaving. The admin of a faction will not be able to leave unless the faction is empty. Leaving the faction as the admin will effectively delete the faction and any pending invites.

###### Input
```sh
DELETE /api/factions/:faction/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "User ID left faction."
}
```
------
#### FactionAddRep
##### PUT /api/factions/:faction/reps/:user
_:faction in URI is a 10-character ID of a valid faction_
_:user in URI is a 10-digit ID of a valid user_
Verifies user token and that user is a member of :faction. Promotes the member to representative and sends out notifications.

###### Input
```sh
PUT /api/factions/:faction/reps/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "User promoted."
}
```
------
#### FactionRemoveRep
##### DELETE /api/factions/:faction/reps/:user
_:faction in URI is a 10-character ID of a valid faction_
_:user in URI is a 10-digit ID of a valid user_
Verifies user token and that user is a representative of :faction. Demotes the representative to member and sends out notifications.

###### Input
```sh
DELETE /api/factions/:faction/reps/:user HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "User demoted."
}
```
------
#### FactionProfile
##### GET /api/factions/:faction
_:faction in URI is a 10-character ID of a valid faction_
Verifies user token and returns a profile document of :faction. If user is a rep or admin of :faction, it will also contain the database id and revision. This can then be used as a base document for [Update Faction Profile](#UpdateFactionProfile).

###### Input
```sh
GET /api/factions/:faction HTTP/1.1
content-type: application/json
x-access-token: access token string
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  ("_id": database id, only if rep or admin)
  ("_rev": database revision, only if rep or admin)
  "id": faction id,
  "name": faction name,
  "admin": [{
    "userid":admin userId,
    "username":admin username
  }]
  "tagline": faction tagline,
  "image": base64-encoded image max 1024x1024px,
  "thumbnail": base64-encoded image max 150x150px,
  "description": faction description,
  "reps": [
    {
      "userid": rep userId,
      "username": rep username
    },
    {
      "userid": rep userId,
      "username": rep username
    }
  ],
  "members": [
    {
      "userid": member userId,
      "username": member username
    },
    {
      "userid": member userId,
      "username": member username
    }
  ]
}
```
------
#### UpdateFactionProfile
##### PATCH /api/factions/:faction
_:faction in URI is a 10-character ID of a valid faction_
Verifies user token and that user is either an admin or rep of :faction. If the payload body contains any of the listed properties, those will be updated in the profile. Note that _id and _rev must be included. Fields not listed below can not be updated with this method. The return object will contain all fields, however, and can be used to update the view.
The "thumbnail" property will be automatically generated from "image" and returned in the return object. If you wish to delete the image and thumbnail, simply pass "image":"".

###### Input
```sh
PATCH /api/factions/:faction HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "_id": database id,
  "_rev": current database revision,
  "tagline": new faction tagline (optional),
  "image": base64-encoded image max 1024x1024px (optional),
  "description": faction description (optional)
}

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "_id": database id,
  "_rev": new database revision,
  "id": faction id,
  "name": faction name,
  "admin": faction admin userid,
  "tagline": faction tagline,
  "image": base64-encoded image max 1024x1024px,
  "thumbnail": base64-encoded image 150x150px,
  "description": faction description,
  "reps": [
    array of faction representative userids
  ],
  "members": [
    array of faction member userids
  ]
}
```
------
### Location API
#### LocationCreate
##### POST /api/locations
Verifies user token, then takes a name and creates a new location belonging to the user. New locations be created without verification, and with opening hours set to 24 hours each day of the week. Users are limited to 10 unverified locations at a time — once a location is verified by an admin, the slot is freed and another can be created.

###### Input
```sh
POST /api/locations HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "name": name of new location (required),
    "description": description of the location (optional, defaults to "<owner>'s Location"),
    "venuetype": venue type string (optional, defaults to "Generic"),
    "lat": latitude as a decimal string (optional),
    "long": longitude as a decimal string (optional)
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Location locationId created."
}
```
------
#### FactionLocationCreate
##### POST /api/factions/:faction/locations
_:faction in URI is a 10-character ID of a valid faction_
Verifies user token and that user is a rep or admin of :faction, then takes a name and creates a new location belonging to the faction. New locations be created without verification, and with opening hours set to 24 hours each day of the week. Users are limited to 10 unverified locations at a time — once a location is verified by an admin, the slot is freed and another can be created.

###### Input
```sh
POST /api/factions/:faction/locations HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "name": name of new location (required),
    "description": description of the location (optional, defaults to "<faction>'s Location"),
    "venuetype": venue type string (optional, defaults to "Generic"),
    "lat": latitude as a decimal string (optional),
    "long": longitude as a decimal string (optional)
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Location locationId created."
}
```
------
#### LocationUpdate
##### PATCH /api/locations/:location
_:location in URI is a 10-character ID of a valid location_

Verifies user token and that the user is the owner of :location (or the creator, if :location is not yet verified), then updates any of the provided fields. All fields are optional — only those included in the payload will be updated.

If :location is **verified**, only `description`, `hours`, and `logo` may be updated. The user must be the owner. Attempting to update any other field returns 403.

If :location is **not verified**, the user may be the owner or creator, and may update `name`, `lat`, `long`, `owner`, `description`, `venuetype`, `logo`, and `hours`.

###### Input (unverified location)
```sh
PATCH /api/locations/:location HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "name": location name (optional),
  "lat": latitude (optional),
  "long": longitude (optional),
  "owner": new owner ID (optional),
  "description": location description (optional),
  "venuetype": venue type (optional),
  "logo": base64-encoded image (optional),
  "hours": hours array (optional)
}
```

###### Input (verified location)
```sh
PATCH /api/locations/:location HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "description": location description (optional),
  "logo": base64-encoded image (optional),
  "hours": hours array (optional)
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Updated."
}
```
------
#### FactionLocationUpdate
##### PATCH /api/factions/:faction/locations/:location
_:faction in URI is a 10-character ID of a valid faction_

_:location in URI is a 10-character ID of a valid location_

Verifies user token and rep or admin status in :faction, then updates any of the provided fields on :location. All fields are optional — only those included in the payload will be updated.

If :location is **verified**, only `description`, `hours`, and `logo` may be updated. Attempting to update any other field returns 403.

If :location is **not verified**, `name`, `lat`, `long`, `owner`, `description`, `venuetype`, `logo`, and `hours` may be updated.

###### Input (unverified location)
```sh
PATCH /api/factions/:faction/locations/:location HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "name": location name (optional),
  "lat": latitude (optional),
  "long": longitude (optional),
  "owner": new owner ID (optional),
  "description": location description (optional),
  "venuetype": venue type (optional),
  "logo": base64-encoded image (optional),
  "hours": hours array (optional)
}
```

###### Input (verified location)
```sh
PATCH /api/factions/:faction/locations/:location HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "description": location description (optional),
  "logo": base64-encoded image (optional),
  "hours": hours array (optional)
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Updated."
}
```
------
#### LocationsList
##### GET /api/locations/all ? \[unverified=true (false default)\]
Verifies user token and returns an array of all registered and verified locations. If ?unverified=true then unverified locations will also be shown.

###### Input
```sh
GET /api/locations/all HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "id": location ID,
    "name": location name,
    "owner": owner id,
    "venuetype": venue type, if available,
    "verified": true or false
  },
  {
    "id": another location ID
    "name": another name
    "owner": owner id,
    "verified": true or false
    "lat": latitude, if available,
    "long": longitude, if available
  }
]
```
------
#### LocationGet
##### GET /api/locations/:location
_:location in URI is a 10-character ID of a valid location_
Verifies user token and returns information about :location. The array "hours" contains entries for all opening times. Each entry contains a "day" with a string describing the weekday, while "open" and "close" are in the HH:MM format. A day may have multiple entries. 00:00 is treated as the start of the day, while 24:00 is treated as the end of the day, for ease of comparison. A location which opens on Wednesday at 9:25am and then stays open past midnight to 3:00am will have the entries listed below. "reviews" is an array of all reviews of :location.
Please be aware that the return object could contain Unicode characters from any language.

###### Input
```sh
GET /api/locations/:location HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "id": location id,
  "name": location name,
  "owner": owner id,
  "venuetype": venue type, if available,
  "verified": true or false,
  "hours": [
    {
      "day": "wednesday",
      "open": "09:25",
      "close": "24:00"
    },
    {
      "day": "thursday",
      "open": "00:00",
      "close": "03:00"
    }
  ],
  "logo": logo, if available,
  "lat": latitude, if available,
  "long": longitude, if available,
  "reviews": [
    {
      "_id": review document id,
      "reviewer": reviewer id,
      "reviewerName": reviewer username at time of review, if available,
      "ts": timestamp,
      "rating": rating 0.1 - 10.0 float,
      "review": review text body
    }
  "ownername": username of owner (or name if owner is a faction)
}
```
------
#### LocationReview
##### POST /api/locations/:location/reviews
_:location in URI is a 10-character ID of a valid location_
Verifies user token and adds a review and/or rating of :location. "rating" is a float between 0.1 and 10.0 inclusive.

###### Input
```sh
POST /api/locations/:location/reviews HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "review": review text body,
    "rating: rating
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Review/rating created."
}
```
------
#### LocationDelete
##### DELETE /api/locations/:location
_:location in URI is the 10-character ID of the location to delete_
Verifies user token and soft-deletes the location by setting `deleted: true` on the document. Verified locations cannot be deleted. For user-owned locations, the requesting user must be the owner. For faction-owned locations, the requesting user must be the admin or a rep of the owning faction. NeoNav administrators may delete any unverified location.

Before deletion, all future non-cancelled events at the location are automatically cancelled and their attendees (and event owners if not already an attendee) are notified. If the location is faction-owned, the faction admin and all reps are notified of the deletion.

###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Location deleted."
}
```
------
#### LocationDeleteReview
##### DELETE /api/locations/review/:review
_:review in URI is the CouchDB document ID of the review to delete_
Verifies user token and redacts the review. The requesting user must be the author of the review, a NeoNav administrator, the individual owner of the reviewed location, or the admin/rep of the faction that owns the reviewed location.

###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Review deleted."
}
```
------
#### LocationGPS
##### POST /api/locations/:location/gps
_:location in URI is a 10-character ID of a valid location_
Verifies that user is a NeoNav Administrator and sets the lat/long of :location.

###### Input
```sh
POST /api/locations/:location/gps HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "lat": latitude, negative if south of equator,
    "long": longitude, negative if west of prime meridian
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "GPS coordinates updated."
}
```
------
#### LocationVerify
##### PATCH /api/locations/:location/verify
_:location in URI is a 10-character ID of a valid location_
Verifies that user is a NeoNav Administrator and switches the verification status of :location. Response will indicate either "verified" or "de-verified", accordingly.

###### Input
```sh
PATCH /api/locations/:location/verify HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Successfully verified."
}
```
------
#### LocationAddEvent
##### POST /api/locations/:location/events
_:location in URI is a 10-character ID of a valid location_
Verifies user token and that they have permissions for :location, then creates an event there according to the post payload.
Please note that "close" must be a later time than "open", and "open" must be a time in the future. No variable may be blank.

###### Input
```sh
POST /api/locations/:location/events HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "name": event name,
    "description": event description,
    "open": event start time (ISO-8601, eg 2022-04-21T03:00:00.000Z),
    "close": event start time (ISO-8601)
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Event created."
}
```
------
#### LocationUpdateEvent
##### PUT /api/locations/events/:event
_:event in URI is the dbid of an event as returned by a function such as [List Remaining Events](#GetRemainingEvents)_
Verifies user token and that user is the event owner, then updates the name/description/open/close to match the payload.
Please note that "close" must be a later time than "open", and "open" must be a time in the future. No variable may be blank.

###### Input
```sh
PUT /api/locations/events/:event HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "name": event name,
    "description": event description,
    "open": event start time (ISO-8601, eg 2022-04-21T03:00:00.000Z),
    "close": event start time (ISO-8601)
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "Event updated."
}
```
------
#### LocationGetEvents
##### GET /api/locations/:location/events
_:location in URI is a 10-character ID of a valid location_
Verifies user token and returns an array with events taking place at :location. Array will be empty if there are none.
Please be aware that the return object could contain Unicode characters from any language.

###### Input
```sh
GET /api/locations/:location/events HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "dbid": event id,
    "name": event name,
    "description": event description,
    "owner": event owner userid (can be faction id),
    "ownername": event owner username or faction name,
    "location": location id,
    "open": event start time (ISO-8601, eg "2024-04-27T03:00:00.000Z"),
    "close": event end time (ISO-8601),
    "attendees": [
      array of attendee userids
    ]
  }
]
```
------
#### GetAttendingEvents
##### GET /api/user/events
Verifies user token and returns an array with events user has responded as going to. Array will be empty if there are none.
Please be aware that the return object could contain Unicode characters from any language.

###### Input
```sh
GET /api/user/events HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "dbid": event id,
    "name": event name,
    "description": event description,
    "owner": event owner userid (can be faction id),
    "ownername": event owner username or faction name,
    "location": location id,
    "open": event start time (ISO-8601, eg "2024-04-27T03:00:00.000Z"),
    "close": event end time (ISO-8601),
    "attendees": [
      array of attendee userids
    ]
  }
]
```
------
#### GetRemainingEvents
##### GET /api/locations/events
Verifies user token and returns an array with all events that have not yet ended. Array will be empty if there are none.
Please be aware that the return object could contain Unicode characters from any language.

###### Input
```sh
GET /api/locations/events HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "dbid": event id,
    "name": event name,
    "description": event description,
    "owner": event owner userid (can be faction id),
    "ownername": event owner username or faction name,
    "location": location id,
    "open": event start time (ISO-8601, eg "2024-04-27T03:00:00.000Z"),
    "close": event end time (ISO-8601),
    "attendees": [
      array of attendee userids
    ]
  }
]
```
------
#### GetAllEvents
##### GET /api/locations/events/all
Verifies user token and returns an array with every event in the system regardless of end time. Array will be empty if there are none.
Please be aware that the return object could contain Unicode characters from any language.

###### Input
```sh
GET /api/locations/events/all HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "dbid": event id,
    "name": event name,
    "description": event description,
    "owner": event owner userid (can be faction id),
    "ownername": event owner username or faction name,
    "location": location id,
    "open": event start time (ISO-8601, eg "2024-04-27T03:00:00.000Z"),
    "close": event end time (ISO-8601),
    "attendees": [
      array of attendee userids
    ]
  }
]
```
------
#### GetUserEvents
##### GET /api/user/events/mine
Verifies user token and returns an array with all events created by the requesting user. Array will be empty if there are none.
Please be aware that the return object could contain Unicode characters from any language.

###### Input
```sh
GET /api/user/events/mine HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "dbid": event id,
    "name": event name,
    "description": event description,
    "owner": event owner userid (can be faction id),
    "ownername": event owner username or faction name,
    "location": location id,
    "open": event start time (ISO-8601, eg "2024-04-27T03:00:00.000Z"),
    "close": event end time (ISO-8601),
    "attendees": [
      array of attendee userids
    ]
  }
]
```
------
#### EventResponse
##### PATCH /api/locations/events/:event
_:event in URI is the dbid of an event as returned by a function such as [List Remaining Events](#GetRemainingEvents)_
Verifies user token and adds the user as an attendee of :event. If user is already an attendee, it will remove user from the event. Response will indicate "joined" or "left".

###### Input
```sh
PATCH /api/locations/events/:event HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Event joined."
}
```
------
#### AddLocationPin
##### POST /api/locations/pins
Verifies user token (API keys not permitted), then inserts a location pin for the requesting user at the supplied coordinates.

###### Input
```sh
POST /api/locations/pins HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "lat": latitude string,
    "long": longitude string
}
```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "message": "Location pin created."
}
```
------
#### ListLocationPins
##### GET /api/locations/pins/:user
_:user in URI is the userid of the target user. If omitted or self, returns the requesting user's own pins._

Verifies user token, then returns recent location pins for :user. Access to another user's pins is granted if any of the following are true:
- The requesting user and target mutually follow each other
- The requesting user and target share at least one faction
- The request is made using a faction API key, and the target is a member of that faction

Otherwise returns 403.

Supports optional query parameters:
- `?since=` — ISO 8601 timestamp; only return pins after this time (default: 5 hours ago)
- `?limit=` — max number of pins to return (default: 1)
###### Input
```sh
GET /api/locations/pins/:user HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  ":user",
  {
    "_id": document id,
    "userid": userid,
    "name": username,
    "lat": latitude string,
    "long": longitude string,
    "ts": ISO 8601 timestamp
  },
  ...
]
```
------
#### ListAllLocationPins
##### GET /api/locations/pins/all
Verifies user token (extended token required), then returns the latest location pin for each mutual follow of the requesting user, plus the requesting user's own latest pin.

Supports optional query parameters:
- `?since=` — ISO 8601 timestamp; only return pins after this time (default: 5 hours ago)

###### Input
```sh
GET /api/locations/pins/all HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  userid,
  {
    "_id": document id,
    "userid": userid,
    "name": username,
    "lat": latitude string,
    "long": longitude string,
    "ts": ISO 8601 timestamp
  },
  ...
]
```
------
#### DeleteLocationPins
##### DELETE /api/locations/pins
Verifies user token (API keys not permitted), then permanently deletes all location pins ever set by the requesting user.

###### Input
```sh
DELETE /api/locations/pins HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "N location pin(s) deleted."
}
```
------
### Images
#### FetchImage
##### GET /api/image/:userid
_:userid in URI is the 10 character ID of a valid user or faction_
Returns the png or jpeg image stored for :userid. If there is none, a default placeholder image is returned.
Data is sourced from the `img-:userid` document in the database.

###### Input
```sh
GET /api/image/:userid HTTP/1.1

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: image/png or image/jpeg
```
------
#### FetchThumbnail
##### GET /api/image/:userid/thumbnail
_:userid in URI is the 10 character ID of a valid user or faction_
Returns the png or jpeg thumbnail stored for :userid. If there is none, a default placeholder image is returned.
Data is sourced from the `img-:userid` document in the database.

###### Input
```sh
GET /api/image/:userid/thumbnail HTTP/1.1

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: image/png or image/jpeg
```
------
#### UpdateImage
##### PUT /api/image
Verifies user token, then stores the provided base64 image as the avatar for the authenticated user. A thumbnail is automatically generated. HEIC/HEIF images are converted to PNG. Upserts an `img-:userid` document in the database.

###### Input
```sh
PUT /api/image HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "image": "data:image/png;base64,..."
}
```
###### Output
```sh
HTTP/1.1 200 OK
{ "message": "Image updated." }
```
------
#### UpdateFactionImage
##### PUT /api/image/faction/:faction
_:faction in URI is the 10 character ID of the target faction. Requires rep or admin access._
Verifies user token and faction rep access, then stores the provided base64 image for :faction. A thumbnail is automatically generated using `fit: inside`. HEIC/HEIF images are converted to PNG. Upserts an `img-:faction` document in the database.

###### Input
```sh
PUT /api/image/faction/:faction HTTP/1.1
content-type: application/json
x-access-token: access token string

{
  "image": "data:image/png;base64,..."
}
```
###### Output
```sh
HTTP/1.1 200 OK
{ "message": "Image updated." }
```
------
### API Keys
#### CreateKey
##### GET /api/auth/apikey
Verifies user token, then creates and returns an API key that can be used as a login token.

###### Input
```sh
GET /api/auth/apikey HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
{
  "key": access token string
}
```
------
#### CreateFactionKey
##### GET /api/factions/:faction/apikey
_:faction in URI is the ID of a faction as returned by a function such as [List User Factions](#UserFactions)_

Verifies user token, and that user is a rep or admin of the relevant faction, then creates and returns an API key that can be used as a login token which uses the faction's ID and name.

Please note that if the user is demoted to member, or removed from, the faction referenced in the key, the key will not be automatically deleted, but will automatically stop working.

###### Input
```sh
GET /api/factions/:faction/apikey HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "key": access token string
}
```
------
#### ListKeys
##### GET /api/auth/apikey/list
Verifies user token, and returns an array containing a list of API keys that the user has created.

###### Input
```sh
GET /api/auth/apikey/list HTTP/1.1
content-type: application/json
x-access-token: access token string

```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
[
  {
    "key": access token string,
    "ts": timestamp,
    "behalf": faction ID, //this is a faction key
    "behalfname": faction name
  },
  {
    "key": access token string,
    "ts": timestamp,
    "behalf": user ID, //this is a personal key
    "behalfname": user name
  }
]
```
------
#### DeleteKey
##### DELETE /api/auth/apikey
_:key string in payload is the full access token string of a key as returned by a function such as [List API Keys](#ListKeys)_

Verifies user token, then deletes a key corresponding to the one supplied in the payload. This will permanently disable the affected key.

###### Input
```sh
DELETE /api/auth/apikey HTTP/1.1
content-type: application/json
x-access-token: access token string

{
    "key": access token string
}
```
###### Output
```sh
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
{
  "message": "OK"
}
```
------

# Frontend Changes Required: Discord Config Restructure

## Summary

The Discord configuration fields have been updated in the backend. The frontend must be updated to match the new API contract.

## Field Changes

| Old Field | New Field | Type | Description |
|-----------|-----------|------|-------------|
| `adminRoleId` | `adminChannelId` | `string` | Discord channel ID for admin commands |
| — *(new)* | `logChannelId` | `string` | Discord channel ID for bot logs |
| `channelIds` | `userChannelIds` | `string[]` | List of Discord channel IDs for user interaction |
| `botToken` | `botToken` | `string` | *(unchanged)* |

## API Endpoints

### GET `/api/discord`

Returns the current Discord configuration.

**Response** `200 OK`:
```json
{
  "botToken": "*******",
  "adminChannelId": "123456789012345678",
  "logChannelId": "987654321098765432",
  "userChannelIds": ["111111111111111111", "222222222222222222"]
}
```

### POST `/api/discord/save`

Saves Discord configuration. All fields are required.

**Request:**
```json
{
  "botToken": "your-bot-token",
  "adminChannelId": "123456789012345678",
  "logChannelId": "987654321098765432",
  "userChannelIds": ["111111111111111111", "222222222222222222"]
}
```

**Response** `200 OK`:
```
"ok"
```

## Frontend Changes Needed

### 1. TypeScript/JavaScript Types

Update the Discord config type definition:

```ts
// Old
interface DiscordConfig {
  botToken: string;
  adminRoleId: string;
  channelIds: string[];
}

// New
interface DiscordConfig {
  botToken: string;
  adminChannelId: string;
  logChannelId: string;
  userChannelIds: string[];
}
```

### 2. Discord Settings Form

Replace the existing form fields:

- **Remove** the "Admin Role ID" input field
- **Add** an "Admin Channel ID" input field (single text input for one channel ID)
- **Add** a "Log Channel ID" input field (single text input for one channel ID)
- **Rename** the "Channel IDs" list to "User Channel IDs" (remains a dynamic list of text inputs)

### 3. API Calls

Update both the fetch (GET) and save (POST) calls to use the new field names:

- `adminRoleId` -> `adminChannelId`
- *(add)* `logChannelId`
- `channelIds` -> `userChannelIds`

### 4. State Management

Update any local state, store, or reactive variables that hold the Discord config to reflect the new field names and the additional `logChannelId` field.

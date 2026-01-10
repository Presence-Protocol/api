# POALPH API Endpoints Documentation

## Base URL
`http://localhost:3000/api`

---

## Data Model

The API uses separate tables for events and series:

| Table | Purpose |
|-------|---------|
| `Collection` (Event) | Single events |
| `SeriesCollection` | Series containers (parent of multiple events) |
| `SeriesEvent` | Individual events within a series |
| `Poap` | POAPs minted for single events |
| `PoapSerie` | POAPs minted for series events |

---

## 📊 Events

### Get All Events
**GET** `/events?limit=50`

Returns all events by default (both single events and series events combined).

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)
- `all` (optional): Set to `true` to return all events without limit
- `type` (optional): Filter by event type
  - `single` - Only single events
  - `series` - Only series events
  - *(not specified)* - Both combined (default)

**Response (default - combined):**
```json
[
  {
    "contractId": "abc123...",
    "eventName": "My Event",
    "caller": "1A2B3C...",
    "isPublic": true,
    "disabled": false,
    "eventType": "single",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "contractId": "event1...",
    "seriesContractId": "series123...",
    "eventName": "Meetup #1",
    "organizer": "1A2B3C...",
    "isPublic": true,
    "eventType": "series",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

---

### Get Events by Creator
**GET** `/events/:address?limit=20`

Get all single events created by an address.

**Response:**
```json
[
  {
    "contractId": "abc123...",
    "eventName": "My Event",
    "caller": "1A2B3C...",
    "isPublic": true,
    "disabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Presences for Single Event
**GET** `/events/minted/:collectionid?limit=10`

Get all presences (POAPs minted) for a single event.

**Response:**
```json
[
  {
    "contractId": "poap1...",
    "collectionContractId": "abc123...",
    "nftIndex": 1,
    "caller": "address1...",
    "isPublic": true,
    "hasParticipated": false,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### Get Addresses for Single Event
**GET** `/events/minted-list/:collectionid?limit=1000&offset=0`

Get list of addresses that minted for a single event.

**Response:**
```json
{
  "addresses": ["1A2B3C...", "4D5E6F..."],
  "pagination": {
    "total": 150,
    "limit": 1000,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### Get Participated Presences for Single Event
**GET** `/events/:collectionId/participated?limit=10&offset=0`

Get only validated presences for a single event.

**Response:**
```json
{
  "presences": [
    {
      "contractId": "poap1...",
      "collectionContractId": "abc123...",
      "nftIndex": 1,
      "caller": "address1...",
      "isPublic": true,
      "hasParticipated": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 120,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get Participation Stats for Single Event
**GET** `/events/:collectionId/participation-stats`

**Response:**
```json
{
  "collectionId": "abc123...",
  "totalPresences": 150,
  "participatedCount": 120,
  "notParticipatedCount": 30,
  "participationRate": 80.0
}
```

---

### Get Event Stats by Organizer
**GET** `/events/stats/totaladdresses?limit=20`

Get count of single events created per organizer.

**Response:**
```json
[
  {
    "caller": "1A2B3C...",
    "eventCount": 15
  }
]
```

---

## 📚 Series Collections

### Get All Series Collections
**GET** `/series?limit=50`

Returns series collections (containers that hold multiple events).

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

**Response:**
```json
[
  {
    "contractId": "series123...",
    "eventName": "Alephium Meetups 2024",
    "caller": "1A2B3C...",
    "isPublic": true,
    "disabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Series Collections by Organizer
**GET** `/series/organizer/:address?limit=20`

Get all series collections created by a specific organizer.

**Response:**
```json
[
  {
    "contractId": "series123...",
    "eventName": "Alephium Meetups 2024",
    "caller": "1A2B3C...",
    "isPublic": true,
    "disabled": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Series Events Added by Organizer
**GET** `/series/events/organizer/:address?limit=20`

Get all individual series events (events within series collections) added by a specific organizer.

**Response:**
```json
[
  {
    "contractId": "event1...",
    "seriesContractId": "series123...",
    "eventName": "Meetup #1 - London",
    "organizer": "1A2B3C...",
    "isPublic": true,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

---

### Get Events Within a Series
**GET** `/series/:seriesId/events?limit=20`

Get all individual events within a specific series collection.

**Response:**
```json
[
  {
    "contractId": "event1...",
    "seriesContractId": "series123...",
    "eventName": "Meetup #1 - London",
    "organizer": "1A2B3C...",
    "isPublic": true,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

---

### Get Series Collection Details
**GET** `/series/:seriesId`

Get detailed information about a specific series collection, including all events within it.

**Response:**
```json
{
  "contractId": "series123...",
  "eventName": "Alephium Meetups 2024",
  "caller": "1A2B3C...",
  "isPublic": true,
  "disabled": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "eventsCount": 5,
  "events": [
    {
      "contractId": "event1...",
      "seriesContractId": "series123...",
      "eventName": "Meetup #1 - London",
      "organizer": "1A2B3C...",
      "isPublic": true,
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

---

### Get Series Stats by Organizer
**GET** `/series/stats/totaladdresses?limit=20`

Get count of series events created per organizer.

**Response:**
```json
[
  {
    "organizer": "1A2B3C...",
    "seriesCount": 25
  }
]
```

---

## 👥 Series Presences (Attendees)

### Get All Presences for a Specific Event in Series
**GET** `/poap-serie/:seriesId/event/:eventId?limit=10&offset=0`

Get all presences (POAPs minted) for a specific event within a series.

**Example:** `/poap-serie/series123/event/0?limit=50`

**Response:**
```json
{
  "presences": [
    {
      "contractId": "poap1...",
      "seriesContractId": "series123...",
      "eventId": 0,
      "nftIndex": 1,
      "caller": "address1...",
      "isPublic": true,
      "hasParticipated": false,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get Addresses That Attended a Specific Event
**GET** `/poap-serie/:seriesId/event/:eventId/addresses?limit=1000&offset=0`

Get list of addresses that attended a specific event (lighter response, just addresses).

**Response:**
```json
{
  "addresses": [
    {
      "address": "1A2B3C...",
      "nftIndex": 1,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 1000,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### Check if User Attended a Specific Event
**GET** `/poap-serie/:seriesId/event/:eventId/address/:address`

Check if a specific address attended a specific event.

**Response:**
```json
{
  "hasPresence": true,
  "count": 2,
  "presences": [
    {
      "contractId": "poap1...",
      "seriesContractId": "series123...",
      "eventId": 0,
      "nftIndex": 1,
      "caller": "address1...",
      "isPublic": true,
      "hasParticipated": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### Get Validated Presences for a Specific Event
**GET** `/poap-serie/:seriesId/event/:eventId/participated?limit=10&offset=0`

Get only presences that have been validated/marked as participated.

**Response:**
```json
{
  "presences": [
    {
      "contractId": "poap1...",
      "seriesContractId": "series123...",
      "eventId": 0,
      "nftIndex": 1,
      "caller": "address1...",
      "isPublic": true,
      "hasParticipated": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 120,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get Participation Statistics for a Specific Event
**GET** `/poap-serie/:seriesId/event/:eventId/participation-stats`

Get validation/participation statistics for a specific event.

**Response:**
```json
{
  "seriesId": "series123...",
  "eventId": 0,
  "totalPresences": 150,
  "participatedCount": 120,
  "notParticipatedCount": 30,
  "participationRate": 80.0
}
```

---

### Get All Presences Across All Events in a Series
**GET** `/poap-serie/minted/:seriesId?limit=100`

Get all presences for ALL events within a series collection.

**Response:**
```json
[
  {
    "contractId": "poap1...",
    "seriesContractId": "series123...",
    "eventId": 0,
    "nftIndex": 1,
    "caller": "address1...",
    "isPublic": true,
    "hasParticipated": false,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### Get All Addresses Who Have Presences in a Series
**GET** `/poap-serie/minted-list/:seriesId?limit=1000&offset=0`

Get addresses that have any presence in the series (across all events).

**Response:**
```json
{
  "addresses": ["1A2B3C...", "4D5E6F..."],
  "pagination": {
    "total": 320,
    "limit": 1000,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### Get All Events a User Attended in a Series
**GET** `/poap-serie/:seriesId/attendee/:address`

Get summary of which events within a series a user attended.

**Response:**
```json
{
  "seriesId": "series123...",
  "address": "1A2B3C...",
  "eventsAttended": 3,
  "events": [
    {
      "eventId": 0,
      "presenceCount": 2,
      "firstAttendance": "2024-01-15T10:00:00.000Z",
      "lastAttendance": "2024-01-15T10:05:00.000Z"
    }
  ]
}
```

---

### Get Detailed User Presences in a Series
**GET** `/poap-serie/:seriesId/address/:address/detailed`

Get all presences a user has across all events in a series, grouped by event.

**Response:**
```json
{
  "seriesId": "series123...",
  "address": "1A2B3C...",
  "totalPresences": 5,
  "eventsAttended": 3,
  "presencesByEvent": {
    "0": [
      {
        "contractId": "poap1...",
        "nftIndex": 1,
        "isPublic": true,
        "hasParticipated": true,
        "createdAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "1": [
      {
        "contractId": "poap3...",
        "nftIndex": 1,
        "isPublic": true,
        "hasParticipated": true,
        "createdAt": "2024-02-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Presence Statistics for All Events in a Series
**GET** `/poap-serie/:seriesId/stats/events`

Get statistics for each event within a series (how many presences, unique attendees).

**Response:**
```json
{
  "seriesId": "series123...",
  "totalEvents": 5,
  "events": [
    {
      "eventId": 0,
      "totalPresences": 150,
      "uniqueAttendees": 145
    },
    {
      "eventId": 1,
      "totalPresences": 200,
      "uniqueAttendees": 180
    }
  ]
}
```

---

## 📈 Statistics & Analytics

### Get Overall Statistics
**GET** `/stats/total`

Get overall platform statistics.

**Response:**
```json
{
  "totalEvents": 105,
  "totalSeriesCollections": 45,
  "totalSeriesEvents": 230,
  "totalPoaps": 5000,
  "totalPoapSeries": 8500
}
```

---

### Get POAP Stats by Address
**GET** `/poap/stats/totaladdresses?limit=20`

Get count of POAPs minted per address (single events).

**Response:**
```json
[
  {
    "caller": "1A2B3C...",
    "eventCount": 50
  }
]
```

---

### Get POAP Serie Stats by Address
**GET** `/poap-serie/stats/totaladdresses?limit=20`

Get count of series POAPs minted per address.

**Response:**
```json
[
  {
    "caller": "1A2B3C...",
    "poapSerieCount": 75
  }
]
```

---

## 🔍 User-Specific Queries

### Get User's Single Event POAPs
**GET** `/poap/:address?unique=true`

Get all POAPs owned by a user for single events.

**Query Parameters:**
- `unique` (optional): If `true`, returns one per collection with count

**Response:**
```json
[
  {
    "contractId": "poap1...",
    "collectionContractId": "abc123...",
    "nftIndex": 1,
    "caller": "1A2B3C...",
    "isPublic": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### Get User's Series POAPs
**GET** `/poap-serie/:address?unique=true`

Get all series POAPs owned by a user across all series.

**Query Parameters:**
- `unique` (optional): If `true`, returns one per series with count

**Response:**
```json
[
  {
    "contractId": "poap1...",
    "seriesContractId": "series123...",
    "eventId": 0,
    "nftIndex": 1,
    "caller": "1A2B3C...",
    "isPublic": true,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

## 🔑 Key Concepts

### Data Model Separation
- **Single Events** (`Collection` table): Standalone events with their own POAPs
- **Series Collections** (`SeriesCollection` table): Parent containers for a group of related events
- **Series Events** (`SeriesEvent` table): Individual events within a series
- **Poap**: POAPs minted for single events (references `collectionContractId`)
- **PoapSerie**: POAPs minted for series events (references `seriesContractId`)

### Multiple Presences
- A user CAN have multiple presences (POAPs) for the same event
- Each presence has a unique `contractId` and `nftIndex`
- Use `count` field to show how many times someone attended

### Participation Status
- `hasParticipated`: Boolean indicating if presence was validated
- Difference between "minted a POAP" vs "actually attended"
- Use `/participated` endpoints to filter only validated presences

### Event IDs
- Events within a series are numbered starting from 0
- `eventId` is the index of the event within the series collection
- Each event can have many presences

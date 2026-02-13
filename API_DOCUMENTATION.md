# API Documentation

Base URL: `http://localhost:5000/api` (Development)

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string",
  "role": "Viewer" // Optional: "Super Admin" | "Clan Admin" | "Editor" | "Viewer"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "string"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Get Current User
```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

---

## Members

### Get All Members
```http
GET /api/members?search=name&status=Living&generation=1&limit=100&page=1
```

**Query Parameters:**
- `search` (optional): Search by name
- `status` (optional): "Living" | "Deceased"
- `generation` (optional): Filter by generation number
- `limit` (optional): Results per page (default: 100)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "members": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 2
  }
}
```

### Get Member by ID
```http
GET /api/members/:id
```

### Create Member
```http
POST /api/members
```

**Permissions:** Editor, Clan Admin, Super Admin

**Request Body:**
```json
{
  "fullName": "string",
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "ISO_DATE",
  "gender": "Male" | "Female" | "Other",
  "email": "string",
  "phone": "string",
  "occupation": "string",
  "education": "string",
  "biography": "string",
  "father": "member_id",
  "mother": "member_id",
  "status": "Living" | "Deceased",
  "generation": 1
}
```

### Update Member
```http
PUT /api/members/:id
```

**Permissions:** Editor, Clan Admin, Super Admin

### Delete Member
```http
DELETE /api/members/:id
```

**Permissions:** Clan Admin, Super Admin

### Get Family Tree
```http
GET /api/members/family-tree/:id
```

Returns member with populated family relationships.

### Get Member Statistics
```http
GET /api/members/stats/overview
```

**Response:**
```json
{
  "totalMembers": 150,
  "livingMembers": 120,
  "deceasedMembers": 30,
  "maleCount": 75,
  "femaleCount": 75,
  "ageGroups": [...],
  "generations": [...]
}
```

---

## Newborn Requests

### Get All Requests
```http
GET /api/newborn-requests?status=Pending
```

**Query Parameters:**
- `status` (optional): "Pending" | "Approved" | "Rejected"

### Create Request
```http
POST /api/newborn-requests
```

**Request Body:**
```json
{
  "fullName": "string",
  "dateOfBirth": "ISO_DATE",
  "gender": "Male" | "Female",
  "father": "member_id",
  "mother": "member_id",
  "placeOfBirth": "string",
  "notes": "string"
}
```

### Approve Request
```http
PUT /api/newborn-requests/:id/approve
```

**Permissions:** Clan Admin, Super Admin

**Request Body:**
```json
{
  "reviewNotes": "string"
}
```

Creates a new member and updates request status.

### Reject Request
```http
PUT /api/newborn-requests/:id/reject
```

**Permissions:** Clan Admin, Super Admin

---

## Clan History

### Get All History Entries
```http
GET /api/history?category=Origin&featured=true
```

### Create History Entry
```http
POST /api/history
```

**Permissions:** Editor, Clan Admin, Super Admin

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "year": 1950,
  "content": "string",
  "category": "Origin" | "Migration" | "Leadership" | "Traditions" | "Achievements" | "Other",
  "images": ["url1", "url2"],
  "relatedMembers": ["member_id"]
}
```

---

## Media Albums

### Get All Albums
```http
GET /api/media?category=Events
```

### Create Album
```http
POST /api/media
```

**Permissions:** Editor, Clan Admin, Super Admin

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "Events" | "Ceremonies" | "Portraits" | "Historical" | "Gatherings" | "Other",
  "eventDate": "ISO_DATE",
  "location": "string"
}
```

### Add Media Item to Album
```http
POST /api/media/:id/items
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "url": "string",
  "type": "image" | "video" | "audio",
  "relatedMembers": ["member_id"],
  "tags": ["tag1", "tag2"]
}
```

---

## Events

### Get All Events
```http
GET /api/events?type=Wedding&status=Planned&upcoming=true
```

### Create Event
```http
POST /api/events
```

**Permissions:** Editor, Clan Admin, Super Admin

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "eventDate": "ISO_DATE",
  "location": "string",
  "type": "Annual Gathering" | "Wedding" | "Funeral" | "Ceremony" | "Meeting" | "Other",
  "organizers": ["member_id"],
  "attendees": ["member_id"]
}
```

---

## Error Responses

All endpoints may return these error responses:

**401 Unauthorized**
```json
{
  "message": "No authentication token, access denied"
}
```

**403 Forbidden**
```json
{
  "message": "You do not have permission to perform this action"
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**500 Server Error**
```json
{
  "message": "Server error",
  "error": "error_details"
}
```

---

## Rate Limits

Current: No rate limiting (TODO)

Recommended: 100 requests per 15 minutes per IP

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `limit`: Results per page (default: 100, max: 1000)
- `page`: Page number (default: 1)

**Response includes:**
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "pages": 2
  }
}
```

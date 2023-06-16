# tinysteps

chord progression generator API and Webapp using Gin and React
currently only planning to generate major and minor scales with extensions
up to thirteenth, by thirds. May consider adding sus chords and modes, etc.
in the future

## Authentication

Basic auth with username:password accounts in gin.
http for now, perhaps when getting hosting done I can
get https certs and set that up?

## Rate Limiting

Nothing planned immediately but before I do any major sharing
of the tool I will implement it

## Endpoints

### /api/progression

- GET: returns a randomly generated chord progression as JSON
  - Query Parameters: root, quality, extension, length
  - Param Defaults: C, major, triad, 4

### /api/songbook

- GET: returns all saved progressions for a user as JSON
- POST: saves a progression in JSON format to their songbook

### /api/songbook:id

- GET: returns a specific progression as JSON from a songbook

### /api/account/register

- POST:

### /api/account/delete

- DELETE:

## /api/account/password

- PATCH:

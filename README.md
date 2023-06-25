# TinySteps

TinySteps is an API for generating chord progressions. It can be used for songwriting,
practice, or just to quickly cook up something to jam over. TinySteps is built using
TypeScript, Node.js, Express, and SQLite3.

## Base URL

The base URL for TinySteps is `https://tinysteps.com` (not yet live).

## Authentication

In order to use most of the endpoints of the API, it is required that you have an account.
To create one, submit a POST request to `/api/user` with a JSON body containing a username
and password. For further requests you will need to include a header with the key `Authorization` and the value `Basic username:password`, where `username` and `password` are the credentials you created, and the `username:password` substring is base64 encoded.

## Rate Limiting

Currently, TinySteps is rate limited to 60 requests per minute globally.
As TinySteps is still in a nascent state, this is subject to change.

## Endpoints

### Generate Progression

- URL: `/api/progression`
- Method: `GET`
- URL Parameters:
  - `root=[string]` (Defaults to C)
  - `quality=[string]` (Defaults to major)
  - `length=[integer]` (Defaults to 4)
  - `extension=[string]` (Defaults to triad)

> Please see the [Chord Generation](#chord-generation) section for info
> on the possible valid values for each parameter.

#### Request

`http://tinysteps.com/api/progression?root=C&quality=major&length=4&extension=triad`

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 200         | OK           |
| 401         | Unauthorized |
| 500         | Server Error |

```json
[
  {
    "root": "G",
    "suffix": "",
    "function": "dominant",
    "extension": "triad"
  },
  {
    "root": "C",
    "suffix": "",
    "function": "tonic",
    "extension": "triad"
  },
  {
    "root": "G",
    "suffix": "",
    "function": "dominant",
    "extension": "triad"
  },
  {
    "root": "E",
    "suffix": "m",
    "function": "tonic",
    "extension": "triad"
  }
]
```

### Save Progression

- URL: `/api/progression`
- Method: `POST`
- URL Parameters: None
- Body Parameters:
  - `name=[string]` (Required)
  - `progression=[array]` (Required)

#### Request

`http://tinysteps.com/api/progression`

```json
{
  "name": "Example Progression",
  "body": [
    {
      "root": "G",
      "suffix": "",
      "function": "dominant",
      "extension": "triad"
    },
    {
      "root": "C",
      "suffix": "",
      "function": "tonic",
      "extension": "triad"
    },
    {
      "root": "G",
      "suffix": "",
      "function": "dominant",
      "extension": "triad"
    },
    {
      "root": "E",
      "suffix": "m",
      "function": "tonic",
      "extension": "triad"
    }
  ]
}
```

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 201         | Created      |
| 400         | Bad Request  |
| 401         | Unauthorized |
| 409         | Conflict     |
| 500         | Server Error |

### Get List of Saved Progressions

### Get Saved Progression

### Delete Saved Progression

### Create User

### Update User Password

### Delete User

## Chord Generation

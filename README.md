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

| Status Code | Description  |
| ----------- | ------------ |
| 200         | OK           |
| 401         | Unauthorized |
| 500         | Server Error |

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

> The provided body must be between 4 and 16 chords long,
> and each chord must be an object with the following properties: root, suffix, function, extension.

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 201         | Created      |
| 400         | Bad Request  |
| 401         | Unauthorized |
| 409         | Conflict     |
| 500         | Server Error |

### Get List of Saved Progressions

- URL: `/api/progression/user
- Method: `GET`
- URL Parameters: None
- Body Parameters: None

#### Request

`http://tinysteps.com/api/progression/user`

#### Response

```json
[
  {
    "name": "Test Progression"
  },
  {
    "name": "Tprog2"
  }
]
```

| Status Code | Description  |
| ----------- | ------------ |
| 200         | OK           |
| 401         | Unauthorized |
| 500         | Server Error |

### Get Saved Progression

- URL: `/api/progression/name/:name`
- Method: `GET`
- URL Parameters: None
- Body Parameters: None

#### Request

`http://tinysteps.com/api/progression/name/Test%20Progression`

#### Response

```json
{
  "name": "Test Progression",
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

| Status Code | Description  |
| ----------- | ------------ |
| 200         | OK           |
| 400         | Bad Request  |
| 401         | Unauthorized |
| 404         | Not Found    |
| 500         | Server Error |

### Delete Saved Progression

- URL: `/api/progression/name/:name`
- Method: `DELETE`
- URL Parameters: None
- Body Parameters: None

#### Request

`http://tinysteps.com/api/progression/name/Test%20Progression`

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 204         | No Content   |
| 400         | Bad Request  |
| 401         | Unauthorized |
| 404         | Not Found    |
| 500         | Server Error |

### Create User

- URL: `/api/user`
- Method: `POST`
- URL Parameters: None
- Body Parameters:
  - `username=[string]` (Required)
  - `password=[string]` (Required)

#### Request

`http://tinysteps.com/api/user`

```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

> Usernames must be unique, contain only letters and numbers, and be between 4 and 20 characters long. Passwords must be between 8 and 24 characters long; they may contain symbols in addition to letters and numbers.

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 201         | Created      |
| 400         | Bad Request  |
| 401         | Unauthorized |
| 409         | Conflict     |

### Update User Password

- URL: `/api/user`
- Method: `PATCH`
- URL Parameters: None
- Body Parameters:
  - `newPassword=[string]` (Required)

#### Request

`http://tinysteps.com/api/user`

```json
{
  "newPassword": "newpassword"
}
```

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 200         | OK           |
| 400         | Bad Request  |
| 401         | Unauthorized |

### Delete User

- URL: `/api/user`
- Method: `DELETE`
- URL Parameters: None
- Body Parameters: None

#### Request

`http://tinysteps.com/api/user`

#### Response

| Status Code | Description  |
| ----------- | ------------ |
| 204         | No Content   |
| 401         | Unauthorized |

## Chord Generation

> The following are the possible values for each of the
> parameters used in the chord generation endpoint.

```javascript
const roots = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
];

const suffixes = [
  "",
  "m",
  "dim",
  "maj7",
  "m7",
  "7",
  "m7b5",
  "maj9",
  "m9",
  "9",
  "m9b5",
  "maj11",
  "m11",
  "11",
  "m11b5",
  "maj13",
  "m13",
  "13",
  "m13b5",
];

const functions = ["tonic", "subdominant", "dominant"];

const extensions = ["triad", "seventh", "ninth", "eleventh", "thirteenth"];
```

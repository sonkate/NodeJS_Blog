# Twitter Authentication with Express.js

This project uses Twitter's OAuth with passport and passport-twitter for user authentication with Express.js.

## User Flow

1. Users click on 'Login', they will be redirected to `/auth/twitter`.
2. If login fails, they will be redirected to `/login`.
3. If login is successful, they will be redirected to `home`.

## Session Storage

In the case of successful login, the `token`, `tokenSecret`, and `id` of the user will be stored in the session.

To access the token in your routes, use `req.user.token`.

## Authentication - OAuth1.0a
- Signature method HMAC-SHA1
- consumer_key: `API_KEY` in .env
- consumer_secret: `API_KEY` in .env
- access_token: `req.user.token`
- access_token_secret: `req.user.token`

## API Endpoints to list followers
This endpoints require Authentication
- `GET https://api.twitter.com/2/users/:id/followers`: Fetch the followers of the user with the given ID.
Path parameter: id(string) required
Query parameter: Optional
- `expansions`(enum): Expansions enable you to request additional data objects that relate to the originally returned users

    More info https://developer.x.com/en/docs/twitter-api/expansions
- `max_results`(integer): The maximum number of results.
- `pagination_token`(string): This parameter is used to get a specified 'page' of results. Used to request the next page of results if all results weren't returned with the latest request, or to go back to the previous page of results.
For example, to return the next page, pass the next_token returned in your previous response.
- `user.fields`(enum): A comma separated list of User fields to display.
- `tweet.fields`(enum): A comma separated list of Tweet fields to display.

## Response example:
```json
{
  "data": [
    {
      "id": "1709978493377822720",
      "name": "Brandie Blossomgame",
      "username": "BrandieBlo64467"
    }
  ],
  "meta": {
    "result_count": 1
  }
}
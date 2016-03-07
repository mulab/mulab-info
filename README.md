# mulab-info

Lab μ infomation management system based on ldap

## development

0. Install a ldap server, for example osixia/openldap .

0. Set proper environment variables. You can write them in secret.env which has been ignored by .gitignore.

0. Run `npm install --no-optional` to install dependencies. Option `--no-optional` is required since one of bunyan's optional dependency will produce error, which prevent debugging.

0. Run `gulp` for compiling.

0. Run `node dist/index.js` and the server is listening at `127.0.0.1:3000`.

## API reference

### POST /auth

Authenticate a user crendential.

field | type | description | required
----- | ----- | ----- | -----
uid | String | username | true
password | String | password | true

Response:

- 403: if wrong credential
- 200: if correct crendential

### POST /logout

Logout.

Response:

- 403: if not logged in
- 200: logout successfully

### GET /u/:uid

Get information of a user

parameter | description | required
----- | ----- | -----
uid | username | true

Response:

- 403: if not logged in.
- 200: user information as json

field | type | description
----- | ----- | -----
uid | String | username
name | String | user's name
groups | Array | groups user belongs to

### POST /u/:uid

Update information of a user

parameter | description | required
----- | ----- | -----
uid | username | true

field | type | description | required
----- | ----- | ----- | -----
name | String | user's name | false

Response:

- 403: if has no permission.
- 200: if update succeed, returns updated user information
- 304: if field name missing.

### /u/:uid/del

Delete a user

Response:

- 403: if not in admin group.
- 200: array of all users.

### Get /u

Get user list

Response:

- 403: if not logged in.
- 200: array of all users.

### POST /u

Add a user

field | type | description | required
----- | ----- | ----- | -----
uid | String | username | true
name | String | user's name | true
password | String | password | true

Response:

- 403: if not in admin group. or username already exists.
- 200: information of added user.

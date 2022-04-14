# Description

The tool allows you to retrieve and output auth0 users by date.

## Setup

```bash
# install dependencies
yarn

# env
cp .env.sample .env
```

## Run

```bash
# Output the usage of the aggregate command mindline application.
yarn console:dev

# Outputs today's number of member registrations to console.
yarn aggregate:today

# Output the number of member registrations to CSV by specifying the date.
# CSV is output to the output directory.
yarn aggregate 2022-03-10 2022-04-13
```

## Environment

```
# Auth0
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
AUTH0_ENDPOINT=
```

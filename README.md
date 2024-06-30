## Description
A simple raw file processor
- to get list of raw files
- analyze raw file info
- The metadata of each file will be sent with graphql format

## route
- GET `blobs/list` : to send blob list to FE (query params may be needed for the pagination)
- GET `blobs/download/:fileName` : to get file buffer
- GET `blobs/metadata/:fileName` : to get file metadata

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

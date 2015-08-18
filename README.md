# todo-backend

**DO NOT USE IN ANY PRODUCTION CAPACITY!!!**

This is project is a teaching tool so I can have available endpoints.

## Install

1. Clone project: `git clone git@github.com:chaseadamsio/todolist-backend.git`
1. Install dependencies: `npm install`
1. Start server: `npm start`
1. Visit `http://localhost:8080` and you should have a `JSON` response.

## Usage

You can hit the following endpoints for the following data:

| Endpoint                           | Method | Response                                |
| ---------------------------------- | ------ | --------------------------------------- |
| `http://localhost:8080/`           | `GET`  | { `version`, `title` }                  |
| `http://localhost:8080/todos`      | `GET`  | [{ `id`, `title`, `description` }, ...] |
| `http://localhost:8080/todos/{id}` | `GET`  | { `id`, `title`, `description` }        |


## Contributing

Run `npm test` locally. All tests should pass and  coverage should be above `90%`.


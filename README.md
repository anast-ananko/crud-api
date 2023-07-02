# Setup and Running

- Use `18 LTS` version of Node.js.
- Clone this repo:

    ```bash
    git clone https://github.com/anast-ananko/crud-api.git
    ```

- Go to downloaded folder:

    ```bash
    cd crud-api
    ```

- Install dependencies:

    ```bash
    npm install
    ```

- Rename file `.env.example` into `.env`.
- Start server:

    To run server in development mode:

    ```bash
    npm run start:dev
    ```

    To run server in production mode:

    ```bash
    npm run start:prod
    ```

    To run server with workers in development mode:

    ```bash
    npm run start:dev:multi
    ```

- Now you can send requests to the address: `http://localhost:3000`.
- Start tests:

    ```bash
    npm run test
    ```

----

- **Get Users**

    Returns json data about users.

  - **URL**

    /api/users

  - **Method:**

    `GET`

----

- **Get User**

    Returns json data about selected user.

  - **URL**

    api/users/{userId}

  - **Method:**

    `GET`

----

- **Create User**

    Creates a new user.

  - **URL**

    api/users

  - **Method:**

    `POST`

----

- **Update User**

    Updates selected user.

  - **URL**

    api/users/{userId}

  - **Method:**

    `PUT`

----

- **Delete User**

    Deletes selected user.

  - **URL**

    api/users/{userId}

  - **Method:**

    `DELETE`

----

# Patagonian Backend Challenge

- [Project implementation summary](#project-implementation-summary)
- [Compiling and running the project](#compiling-and-running-the-project)
    - [Requirements](#requirements)
    - [Instructions](#instructions)
- [Run load script](#run-load-script)
    - [Resources](#resources)
    - [Instructions](#instructions)

# Project implementation summary

This project was implemented using the next tools or libraries:

- Nodejs, Typescript, HapiJs, Mongodb and Docker.
- For compile and run this project you only will need Docker and Docker compose since everything is encapsulated on a Docker image.
- The Spotify is implemented using the [Client Credentials Flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow)
- The server runs in [http://127.0.0.1:8888](http://127.0.0.1:8888).

# Compiling and running the project

### Requirements

- Docker Engine version `2.3.0.4` or similar. If you don't have it installed, you can see instructions [here](https://docs.docker.com/engine/install/).
- Docker Compose version `1.26.2` or similar. If you don't have it installed, you can see instructions [here](https://docs.docker.com/compose/install/).
- (Optional) If you want to connect to Mongo database, you could install [MongoDB Compass](https://www.mongodb.com/try/download/compass).
    - Use the variable `DATABASE_CONNECTION_URI` available on `config/.env.dev`.
- (Optional) If you want to execute project on development mode, you need install NodeJs v12.8.3 and NPM v6.9.0

### Instructions

1. Create and Spotify application [here](https://developer.spotify.com/documentation/general/guides/app-settings/), get your clientId and clientSecret tokens and setup these in `config/.env.production` and `config/.env.dev`.
2. Install Docker Engine and Docker Compose services, then start Docker Engine.
3. Open a terminal or console.
4. Create the docker network bridge used to allows communication between both containers server and database:

    ```bash
    docker network create -d bridge --subnet 172.0.1.0/24 --gateway 172.0.1.1 songs-net
    ```

5. Execute project using `docker-compose`

    **IMPORTANT:** The next commands must be executed on root project directory.

    - Execute database and server

        ```bash
        docker-compose up
        ```

    - Execute only database.

        ```bash
        docker-compose up database
        ```

    - Execute only server

        ```bash
        docker-compose up server
        ```

    - Execute containers forcing the build

        ```bash
        # Both
        docker-compose up --build
        # Only server
        docker-compose up --build server
        # Only database
        docker-compose up --build database
        ```

6. (Optional) Execute on development mode

    **IMPORTANT:** The next commands must be executed on root project directory

    1. Install NPM dependencies

        ```bash
        npm i
        ```

    2. Execute only database service using `docker-compose`

        ```bash
        docker-compose up database
        ```

    3. Execute server on development mode

        ```bash
        npm run dev
        ```

    4. (Optional) Execute test

        ```bash
        npm test -i test/modules/songs/GetAllAlbumsByArtistIdUseCase.test.ts
        ```

# Run load script

### **Resources**

- `docs/api.html`
- `docs/postman/Patagonian Backend Challenge.postman_collection.json`
- `docs/postman/Patagonian Backend Challenge.postman_environment.json`
- cURL commands

    ```bash
    # Populate
    curl --location --request GET 'http://127.0.0.1:8888/api/v1/songs/populate?ids=1r4hJ1h58CWwUQe3MxPuau,2gRP1Ezbtj3qrERnd0XasU'

    # Get songs with pagination
    curl --location --request GET 'http://127.0.0.1:8888/api/v1/songs?artistName=Maluma&limit=5&offset=10'

    # Get a song by songId
    curl --location --request GET 'http://127.0.0.1:8888/api/v1/songs/0GgGvBbhKzVKeiW8JdgyTh'
    ```

### **Instructions**

These are the instruction for run script that loads into a database all the songs from a list of Artist's IDs.

1. The script is executed using `/songs/populate` endpoint.
2. Build a list of Artist's IDs separated by comma and set in ids query param.
3. Execute the endpoint `/songs/populate`. Await for response that say you how much artists and albums are will be processed.
4. When the endpoint response, is possible that songs continue loading in background because can be a long process (depend on amount of artists) but you can check the log in the terminal.

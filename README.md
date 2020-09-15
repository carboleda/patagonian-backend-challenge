1. Install docker and docker compose services, then start docker service

1. Create docker network bridge:
    ```shell
    docker network create -d bridge --subnet 172.0.1.0/24 --gateway 172.0.1.1 songs-net
    ```

1. Ejecutar project using docker-compose

    **IMPORTANT:** The next commands must be executed on root project directory

    1. Execute and force build database and server
        ```
        docker-compose up --build
        ```
    1. Execute database and server
        ```
        docker-compose up
        ```
    1. Execute only database
        ```
        docker-compose up database
        ```
    1. Execute only server
        ```
        docker-compose up server
        ```

1. Execute on development mode

    **IMPORTANT:** The next commands must be executed on root project directory
    1. Execute database using the command explained in the numeral `1.3`
    1. Execute server using next command
        ```
        npm run dev
        ```

1. Execute test
    ```
    npm test -i test/modules/songs/GetAllAlbumsByArtistIdUseCase.test.ts
    ```

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/6b56bab70a41c51618ed)

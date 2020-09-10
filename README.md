1. Install docker and docker compose services, then start docker service

2. Create docker network bridge:
    ```shell
    docker network create -d bridge --subnet 172.0.1.0/24 --gateway 172.0.1.1 songs-net
    ```

3. Ejecutar el docker-compose
    ```
    cd patagonian-backend-challenge
    docker-compose up
    ```
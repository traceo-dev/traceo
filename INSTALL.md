# Installation guide


Traceo is an open-source, self-hosted set of tools for monitoring application health by collecting and aggregating data from the software. To do its job Traceo needs a few instruments:

1. Main Traceo application
2. Worker handling incoming events from your software
3. PostgreSQL
4. Clickhouse (storing non-relational data as metrics or logs)
5. Kafka

In the case of installing the Traceo instance on your own device, the most convenient way is to use docker compose. However, other installation methods are also supported:

- [Installation guide](#installation-guide)
  - [Docker compose](#docker-compose)
    - [Basic](#basic)
    - [Manually](#manually)
  - [Docker](#docker)
  - [Kubernetes](#kubernetes)

After successfully instalation you can log in to your account with this credentials:
```
username: admin
password: admin
```
Remember to change your password immediately for security reasons.

## Docker compose
Docker-compose installation instructions can be found [here](https://docs.docker.com/compose/install/).

### Basic
The easiest possible way to install using docker compose is to use the following one-liner:
```
$ curl -L https://raw.githubusercontent.com/traceo-dev/traceo/develop/docker-compose.yml -o docker-compose.yml && docker compose up
```
After invoking this command, the docker-compose.yml file will be downloaded and run on your machine.

### Manually
You can do this also manually by:

0. Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (in case you don't have it).
1. Clone this repository:
```
git clone https://github.com/traceo-dev/traceo.git
```
2. Go to the folder containing the source code:
```
cd traceo
```
3. Run this command to up docker-compose:
```
docker compose up
```

The first boot may take several minutes. 




Traceo uses [pm2](https://pm2.keymetrics.io/) to run the application and worker. In case you need to view the logs, you can do it like this:

1. Run this command from the root of the repository:
```
docker compose ps -q traceo
```
2. Copy returned SHA and paste to below command and:
```
docker exec -it [your-sha] sh
```
3. At this point, you have access to the container with the application. Run the following command to preview the application properties in the pm2 view:
```
pm2 monit
```

See the pm2 documentation [here](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/).

After all, Traceo should be accessible in http://localhost:3000.

<!-- This docker-compose.yml default is using latest image from docker registry. If you want to use different version of Traceo Instance you can define tag like below:
```
TAG=1.0.0 docker compose up
``` 

List of available docker images can be found in [docker registry](https://hub.docker.com/repository/docker/traceo/traceo/tags?page=1&ordering=last_updated).-->


## Docker

If you want to use the docker image to install Traceo, you must first prepare several platforms necessary for the proper operation of the application.

1. Download your own [PostgreSQL](https://www.postgresql.org/download/) database.
2. Download your own [Clickhouse](https://clickhouse.com/docs/en/install) database.
3. Download your own [Kafka](https://kafka.apache.org/quickstart) message broker instance.

After completing all these steps, we can move on.

1. Create `.env.docker` file with provided envs:
```
PG_HOST=[your-postgres-host]
PG_PORT=5432
PG_DB_NAME=traceo
PG_PASS=postgres
PG_USER=postgres

KAFKA_CLIENT_ID=traceo-kafka
KAFKA_HOSTS=[your-kafka-host]
KAFKA_GROUP_ID=traceo-kafka-group

CLICKHOUSE_USER=default
CLICKHOUSE_HOST=[your-clickhouse-host]
CLICKHOUSE_PASSWORD=
```
2. Set values for `PG_HOST`, `KAFKA_HOSTS` and `CLICKHOUSE_HOST` depending on your own installed instances. You can also replace other envs if you need it.

3. Run this command to build docker image:
```
docker run \
  -d -p 3000:3000 \
  --env-file .env.docker \
  --name=traceo \
  traceo/traceo
```

If you don't want to use the envs file, you can also specify them in the run command as below:
```
docker run \
  -d -p 3000:3000 \
  -e PG_HOST=[env] \
  -e PG_PORT=5432 \
  -e PG_DB_NAME=traceo \
  -e PG_PASS=postgres \
  -e PG_USER=postgres \
  -e KAFKA_CLIENT_ID=[env] \
  -e KAFKA_HOSTS=[env] \
  -e KAFKA_GROUP_ID=[env] \
  -e CLICKHOUSE_USER=default \
  -e CLICKHOUSE_HOST=[env] \
  --name=traceo \
  traceo/traceo
```

TIP: You can provide multiple hosts to `KAFKA_HOSTS` env by separate them with comma, eq. `KAFKA_HOSTS=kafka:29092,kafka:9092`.

After all, Traceo should be accessible in http://localhost:3000. To using other port you can change [ports mapping](https://docs.docker.com/config/containers/container-networking/) in above commands.

## Kubernetes

Under implementation. come back later!

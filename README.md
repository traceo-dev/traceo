# Traceo
Traceo is an open-source, self-hosted set of tools for monitoring application health by collecting and aggregating data from the software. 

# Development status
Not ready for production use.

<!-- Estimated release time for the production-ready version (1.0.0): 01.05.2023 -->

# SDK
To start using the Traceo platform, you need to integrate with [Traceo SDK](https://github.com/traceo-io/traceo-node). Informations about the process of implementation SDK inside your software is in README of the each SDK.
- [`@traceo-sdk/node`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/node) - NodeJS
- [`@traceo-sdk/react`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/react) - React
- [`@traceo-sdk/vue`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/vue) - Vue


# Installation
At this point, the installation of the Traceo platform is done by using the docker image.

To pull or run already existing docker image:
```
docker run -d --name=traceo -p 3000:3000 traceo/traceo
```

The application will be available at http://localhost:3000.

The default user is `admin/admin`. 

If you want to use a custom `port` then you should use:
```
docker run -d --name=traceo -p <port>:3000 traceo/traceo
```

### ***Database***
By default, Traceo Platform uses the SQLite database. Once the container is stopped, all your data will be deleted. To avoid this, create a docker volume and mount it at application startup.
```
docker volume create traceo-volume

docker run -d --name=traceo -v traceo-volume:/usr/traceo -p 3000:3000 traceo/traceo
```

If you want to integrate with the PostgreSQL database you have to set the environment variables as below:

```
docker run \
  -d -p 3000:3000 \
  -e PG_HOST="POSTGRES_HOST" \
  -e PG_PORT="POSTGRES_PORT" \
  -e PG_DB_NAME="POSTGRSES_DB_NAME" \
  -e PG_PASS="POSTGRES_PASSWORD" \
  -e PG_USER="POSTGRES_USER" \
  --name=traceo \
  traceo/traceo
```
# Features
### ***Incidents capture***
Capture all exceptions and errors occurs in your software. Each incident is unique and if another incident of the same type occurs, then it is grouped with the first one. 

<p align="center">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-incidents-list.PNG" width="400">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-incident-preview.PNG" width="400">
</p>

### ***Logs analysis***
Monitor all the important and sensitive places in your software, recording the relevant information, which is then sent to Traceo so that you can later efficiently search for the information you need.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-logs.PNG">

### ***Metrics***
Record data about your server, like eq. CPU utilization or RAM usage.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-metrics.PNG">

### ***Performance (v. > 1.0.0)***
Control the performance of your application by collecting web-vitals data from your browser.

<p align="center">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-web-perf-list.PNG" width="400">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-web-perf.PNG" width="400">
</p>

# Support

Feel free to create Issues or Pull Request.

# License

Traceo is licensed under the [Apache License, Version 2.0](https://github.com/traceo-dev/traceo/blob/main/LICENSE).

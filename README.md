# Traceo
Traceo is an open-source set of tools for monitoring application health by collecting and aggregating data from the software. 

# Development status
Not ready for production use.

# SDK
To start using the Traceo platform, you need to integrate with the [Traceo SDK](https://github.com/traceo-io/traceo-node), which will start monitoring the status of your application.

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
# Guide
### ***Incidents***
An incident is an exception caught by the SDK which extracts all the most important information about it and sends it to Traceo. Each incident is unique and if another incident of the same type occurs, then it is grouped with the first one. The uniqueness of the incident is checked by comparing the content sent by the SDK.
<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-incidents-list.PNG">

An incident can have one of three statuses: `Resolved`, `Unresolved`, and `In Progress`. This status should be updated as work progresses to resolve the issue.

Incident details contain the most important information about the given error. As the SDK parses the incident, the parser breaks down each stack trace into individual traces, from which it extracts information about the location of the error. Thanks to this, it can retrieve the code where the exception occurred. 

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-incident-preview.PNG">

### ***Logs***

Another important feature of Traceo is the logger feature which allows you to record the necessary information from the operation of the application. Each log is displayed in the application console (`stdout`) and sent to the Traceo platform, which can be viewed in the `Explore tab`.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-logs.PNG">

### ***Runtime configuration***

The runtime configuration is a collection of data that is retrieved from the application during startup. In the setting of these data is eq. information about the operating system, scripts, or dependencies used in your application. Depending on the use of a specific SDK, the data may be different.

### ***Metrics***

Metrics are a set of data taken from a given source, correlated with the time of their occurrence. In Traceo, metrics are used to record data about the software your application runs on, including CPU usage, memory usage, RSS, and more. To start collecting data from software, Traceo first needs a place to store this information. For this purpose, the previously prepared InfluxDB instance must be connected to the platform in the `Settings|Data Source` tab.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-metrics.PNG">

Remember also to configure options in your `TraceoClient` configuration in your app. More information about it is [here](https://github.com/traceo-io/traceo-node).

# Support

Feel free to create Issues, Pull Requests, or Discussions.

# License

Traceo is licensed under the [Apache License, Version 2.0](https://github.com/traceo-dev/traceo/blob/main/LICENSE).

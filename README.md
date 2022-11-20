# Traceo
Traceo enables continuous monitoring of application health by collecting and aggregating data from the software. The fast and intuitive user interface allows you to quickly and efficiently navigate through the data, and the graphical presentation of data allows for a faster understanding of the seriousness of a given situation.



<!-- # Screenshots

<p align="center">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-1.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-2.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-3.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-4.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-5.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-6.PNG" width="270">
</p> -->

# Demo
App preview can be found [here](http://ec2-3-74-163-234.eu-central-1.compute.amazonaws.com/). Credentials: `guest`/`Guest!`. 

# SDK
To start using the Traceo platform, you need to integrate with the [Traceo SDK](https://github.com/traceo-io/traceo-node), which will start monitoring the status of your application.

# Installation
At this point, the installation of the Traceo platform is done using the docker image only.

To pull or run already existing docker image:
```
docker run -d --name=traceo -p 8080:8080 traceo/traceo
```
If you want to use custom `port` then you shuld use:
```
docker run -d --name=traceo -p <port>:8080 traceo/traceo
```
Default user is `admin/admin`. 

# Guide

### ***Database***

By default, Traceo Platform uses the SQLite database, so for testing and development purposes, this may be enough. If you want to use Traceo with production data, we recommend to use a PostgreSQL database. To do this, set the environment variables as below:

```
docker run \
  -d -p 80:3000 \
  -e PG_HOST="POSTGRES_HOST" \ 
  -e PG_PORT="POSTGRES_PORT" \
  -e PG_DB_NAME="POSTGRSES_DB_NAME" \
  -e PG_PASS="POSTGRES_PASSWORD" \
  -e PG_USER="POSTGRES_USER" \
  --name=traceo \
  traceo/traceo
```

<!-- ### First steps

After logging in to the Traceo platform through the administrator account, the most important thing to do is to change the password of that account in order to protect against unauthorized access to the platform. Remember that the administrator account has all the highest moderation rights in any application, and its data (except for the password) cannot be changed and is read-only.

### Users

To add a new user to the application, go to the `Management | Accounts` tab and click the `New Account` button. A modal will appear with fields to fill that require a username and password. Each new account initially has the status `Inactive`, which changes to `Active` after the first login. Additionally, each account may be blocked and deleted by the System Administrator (and only by him). To do this, go to the data of a given user and select the appropriate action from the buttons at the top of the screen. From the level of user details, you can freely manipulate his data, permissions and applications to which he has access.

### Applications

Creating an application that we connect with the SDK can be done both from the `Management` panel and from the list of applications in the `Overview` panel. To do this, click the `New App` button and name your app. After approval, the application will appear on the list and you can go to its details. Only platform administrators can add new app.

### Dashboard

The application dashboard shows, first of all, the number of incidents in a given period in order to be able to quickly react to emerging problems. Incidents are presented in graphs to provide graphical information about the scale of possible problems with the application to which the SDK is connected.
 -->
### ***Incidents***

An incident is an error or exception caught by the SDK which extracts all the most important information about it and sends it to Traceo which graphically depicts the problem. Each incident is unique for a given application, and if another incident of the same type occurs, then he is grouped to the first one. The uniqueness of the incident is checked by comparing the content sended by the SDK. The most important part of the comparison is the type (eg BadRequestException), the message (eg This request cannot be processed.) and the full stacktrace.

To see all incidents captured by the SDK, visit the Incidents subpage in the dashboard of a specific application. There is an list with each record containing information about the incident status, number of errors and comments, a graph showing the occurrence of the error, and assigned user.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-3.PNG">

An incident can have one of three statuses: `Resolved`, `Unresolved`, and `In Progress`. This status should be updated as work progresses to resolve the issue. After going to the details of the incident, we can edit its status, assigned person and even delete it.

Incident details contain the most important information about the given error. As the SDK parses the incident, parser breaks down each stack trace into individual traces, from which it extracts information about the location of the error. Thanks to this, it is able to retrieve the code where the exception occurred. This code is shown in the incident details in the `Stacktrace` section.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-4.PNG">

### ***Logs***

Another important feature of Traceo is logger feature which allows you to record the necessary information from the operation of the application. Each log is displayed in the application console (`stdout`) and sent to the Traceo platform, which can be viewed in the `Explore tab`. At the moment, logs are stored for up to three days, and the limit of logs downloaded for a given time interval (30 minutes) is 1000. In the future, a wider possibility of searching logs will be introduced, both by text fragments and according to specific time intervals.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-5.PNG">

### ***Runtime configuration***

Runtime configuration is a collection of data that is retrieved from the application during startup. In the set of these data are Eq. information about the operating system, scripts or all dependencies used in your application. Depending on the use of a specific SDK, the data may be different.

### ***Metrics***

Metrics are a set of data taken from a given source, correlated with the time of their occurrence. In Traceo, metrics are used to record data about the software your application runs on, including CPU usage, memory usage, RSS and more. To start collecting data from software, Traceo first needs a place to store this information. For this purpose, the previously prepared InfluxDB instance must be connected to the platform in `Settings|Data Source` tab. There are also a plan to integrate the user with Prometheus TSDB. More information in the future.

After entering the appropriate data, confirm it by clicking `Save & Test`. If the Traceo platform has a issue with connecting to your InfluxDB instance, you will be informed about it with an appropriate message. Remebers also to configure options in your `TraceoClient` configuration in your app. More informations about it is [here](https://github.com/traceo-io/traceo-node).

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-6.PNG">

# Support

Feel free to create Issues, Pull Request or Discussions. If you want to contact with one-man-army working on this app click [here](mailto:piotr.szewczyk.software@gmail.com).

# License

MIT License

Copyright (c) 2022 Piotr Szewczyk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

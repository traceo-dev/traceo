# Traceo
Traceo is a toolkit to monitor application.

# Screenshots

<p align="center">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-1.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-2.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-3.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-4.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-5.PNG" width="270">
</p>

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
Default user is `admin/admin`. We strongly recommend to change the administrator account password immediately after first login.

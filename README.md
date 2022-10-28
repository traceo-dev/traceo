# Traceo

Traceo is a simple but powerfull developer tool to catch every bugs and exceptions in your software. Integrated with our package in 15 minutes and and keep all problems under control.

# Screenshots

<p align="center">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-1.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-2.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-3.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-4.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-5.PNG" width="270">
</p>

# Traceo SDK

- [NodeJS](https://github.com/traceo-io/traceo-node)

# Installation

Build docker image (from project root):
```
sh scripts/build.sh
```

Default tag is set to `latest`, to use custom tag:
```
sh scripts/build.sh <tag>
```

Run docker image:
```
docker run -d --name=traceo -p 8080:8080 traceo/traceo
```

Run docker image on custom port:
```
docker run -d --name -traceo -p <PORT>:8080 traceo/traceo
```
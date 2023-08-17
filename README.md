<img src="https://github.com/traceo-dev/traceo/blob/develop/public/packages/app/public/traceo-fav.PNG" width="100px">

# Traceo
Traceo is an open-source, self-hosted set of tools for monitoring application health by collecting and aggregating data from the software. 

- Capture and collect all exceptions in one place
- Troubleshoot your code with immediate insight into where the problem is
- Monitor application resource consumption and visualize it on the dashboard
- Create your own visualizations to have quick access to the information you need
- Collect and view logs, metrics and spans

Gathering the information you need is done using the [Traceo SDK](https://github.com/traceo-io/traceo-node), a library for NodeJS that can be downloaded from npm. Implementations for more technologies and programming languages will also be added in the near future.


# Screenshots
<p align="center">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/v1.2.0/traceo-incident.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/v1.2.0/traceo-dashboard.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/v1.2.0/traceo-dashboard-panel.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/v1.2.0/traceo-explore-metrics.PNG" width="270">
  <img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-web-perf.PNG" width="270">
</p>

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Documentation](#documentation)
- [SDK](#sdk)
- [Support](#support)
- [License](#license)
  
# Installation
Traceo is self-hosted software, so we recommend installing it using docker-compose. The easiest possible way to install using docker compose is to use the following one-liner:

```
$ curl -L https://raw.githubusercontent.com/traceo-dev/traceo/develop/docker-compose.yml -o docker-compose.yml && docker compose up -d
```
After invoking this command, the docker-compose.yml file will be downloaded and run on your machine.

Full installation guide can be found [here](https://github.com/traceo-dev/traceo/blob/develop/INSTALL.md).

# Features
With the following features you will be able to fully control your software

- [Catch all exceptions in your software](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/node#incidents-handling)
- Collect [logs](https://github.com/traceo-dev/traceo-javascript/blob/develop/packages/node/README.md#logger), [metrics](https://github.com/traceo-dev/traceo-javascript/blob/develop/packages/opentelemetry-node/README.md#metrics) and [spans](https://github.com/traceo-dev/traceo-javascript/blob/develop/packages/opentelemetry-node/README.md#spans)
- Explore all information in one [place](https://github.com/traceo-dev/traceo/blob/develop/DOCUMENTATION.md#dashboards)
- Get [web-vitals](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/react#performance) data from your browser apps
- [Create](https://github.com/traceo-dev/traceo/blob/develop/DOCUMENTATION.md#create-new-panel) custom visual panels with the metrics that are important to you

And many more!

# Documentation
The full Traceo platform documentation can be found [here](https://github.com/traceo-dev/traceo/blob/develop/DOCUMENTATION.md). In case of problems, don't be afraid to start a discussion on Github.

# SDK
To start using the Traceo platform, you need to integrate with one of the Traceo SDKs. Information about the process of implementing the SDK in your software is included in the README file of each SDK.

| Platform | SDK  | Version   |
| :---: | :---: | :---: |
| ![My Skills](https://skillicons.dev/icons?i=java&perLine=1) | [traceo-sdk/java](https://github.com/traceo-dev/traceo-java/blob/master/traceo-sdk/README.md)  | [![Maven Central](https://maven-badges.herokuapp.com/maven-central/org.traceo/traceo-sdk/badge.svg)](https://maven-badges.herokuapp.com/maven-central/org.traceo/traceo-sdk/) |
| ![My Skills](https://skillicons.dev/icons?i=java&perLine=1) | [traceo-sdk/opentelemetry](https://github.com/traceo-dev/traceo-java/blob/master/traceo-sdk-opentelemetry/README.md) |[![Maven Central](https://maven-badges.herokuapp.com/maven-central/org.traceo/traceo-sdk-opentelemetry/badge.svg)](https://maven-badges.herokuapp.com/maven-central/org.traceo/traceo-sdk-opentelemetry/) |
| [![My Skills](https://skillicons.dev/icons?i=js&perLine=1)](https://skillicons.dev) | [traceo-sdk/node](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/node)  | [![npm version](https://badge.fury.io/js/@traceo-sdk%2Fnode.svg)](https://badge.fury.io/js/@traceo-sdk%2Fnode) |
| ![My Skills](https://skillicons.dev/icons?i=js&perLine=1) |  [traceo-sdk/opentelemetry-node](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/opentelemetry-node)  |  [![npm version](https://badge.fury.io/js/@traceo-sdk%2Fopentelemetry-node.svg)](https://badge.fury.io/js/@traceo-sdk%2Fopentelemetry-node) |
| ![My Skills](https://skillicons.dev/icons?i=react&perLine=1) | [traceo-sdk/react](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/react)  | [![npm version](https://badge.fury.io/js/@traceo-sdk%2Freact.svg)](https://badge.fury.io/js/@traceo-sdk%2Freact) |
| ![My Skills](https://skillicons.dev/icons?i=vue&perLine=1) | [traceo-sdk/vue](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/vue) | [![npm version](https://badge.fury.io/js/@traceo-sdk%2Fvue.svg)](https://badge.fury.io/js/@traceo-sdk%2Fvue) |


Remember that for each version of the Traceo platform there may be a specific SDK version. You can monitor them in [Release](https://github.com/traceo-dev/traceo/releases).

# Support
Feel free to create Issues or Pull Request.

# License
Traceo is licensed under the [Apache License, Version 2.0](https://github.com/traceo-dev/traceo/blob/main/LICENSE).

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
Full instalation guide can be found [here](https://github.com/traceo-dev/traceo/blob/develop/INSTALL.md).

# Features
### ***Incidents capture***
Capture all exceptions and errors occurs in your software. Each incident is unique and if another incident of the same type occurs, then it is grouped with the first one. 

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-incident-preview.PNG">

### ***Logs analysis***
Monitor all the important and sensitive places in your software, recording the relevant information, which is then sent to Traceo so that you can later efficiently search for the information you need.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-logs.PNG">

### ***Metrics***
Record data about your server, like eq. CPU utilization or RAM usage.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-metrics.PNG">

### ***Performance (v. > 1.0.0)***
Control the performance of your application by collecting web-vitals data from your app.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/traceo-web-perf.PNG">

# Support

Feel free to create Issues or Pull Request.

# License

Traceo is licensed under the [Apache License, Version 2.0](https://github.com/traceo-dev/traceo/blob/main/LICENSE).

<img src="https://github.com/traceo-dev/traceo/blob/develop/public/packages/app/public/traceo-fav.PNG" width="100px">

# Traceo Documentation
Traceo is an open-source, self-hosted set of tools for monitoring application health by collecting and aggregating data from the software.

## Contents
* [Installation](#installation)
* [SDK](#sdk)
* [Administration](#administration)
* [Projects](#projects)
* [Incidents](#incidents)
* [Dashboards](#dashboards)
* [Explore](#explore)
<!-- * [Performance](#performance) -->
  
## Installation

The ability to run the application on your own environment is offered using Docker and Docker-compose. Full installation instructions are available here.
After the platform is launched correctly, you will be able to send data from your software to Traceo, which will receive, aggregate and visualize data on the application's graphical interface.

When the application is started for the first time, a basic administrative user is created, thanks to which you can log in using *admin/admin*.
Remember to change the password for this user immediately after logging in for the first time.

## SDK
Collecting and sending data to the Traceo platform is handled by a set of SDKs, which at the moment offer support only for NodeJS environments and browser applications.

Information about the process of implementing the SDK in your software is included in the README file of each SDK.

- [`@traceo-sdk/node`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/node) - NodeJS
- [`@traceo-sdk/opentelemetry-node`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/opentelemetry-node) - Open Telemetry for NodeJS
- [`@traceo-sdk/react`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/react) - React
- [`@traceo-sdk/vue`](https://github.com/traceo-dev/traceo-sdk/tree/develop/packages/vue) - Vue


If you encounter bugs or problems, please report them [here](xxx).

## Administration
The administrator panel is intended only for authorized persons who have administrator status on their account. Remember that the wrong people with administrator privileges can cause damage.

### Users
A user is any person authorized to use the Traceo application. To create a new user, go to the list of all instance users and click **New user** button. We will then be redirected to a page with basic data about the new user that needs to be filled in. After creating the user, provide the credentials to the appropriate person who should immediately change the password to access the account.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/admin-panel.PNG">

#### User details
In the user view, each administrator has the ability to change their data. Be sure to do this with care and discuss any name or email changes with the relevant user.

You can block a user by clicking the **Disable User** button. Such a user will be automatically logged out of all their devices and re-logging into the platform will be blocked.

Deleting a user is irreversible. To remove it, you must confirm it with the password for the application.

#### User permissions
In this section you can set whether the user can be an administrator for the entire Traceo instance. Remember to approach it responsibly. A user with admin privileges will be able to create, edit and delete both other users and projects.

#### User projects list
Here you can see the list of projects to which a given user is assigned, as well as change his roles in the project. You can also add it to projects as well as remove it from them.

### Projects
A project is a representation of a specific asset you want to monitor, most often it's software you're developing or an external asset you just want to visualize in your application.

Only administrators can create new projects. If you want to create new project, you have to click on **New project** button. Select then the target type of technology used in the software that you want to monitor.
Remember that in order for the data coming from your software to be correctly received, the appropriate SDK must be used.

At the same time, it is not recommended to create one application responsible for monitoring many programs. Instead, create dedicated apps for each resource you monitor.

#### Project details
The project overview contains the most important information about the project, such as ID, name or number of incidents. You can delete the entire project here, which you must confirm by entering your account password.

In the project members overview, you have the option to remove them from the project and change their roles in the project.

### Instance info
The instance Info contains all the information about the currently installed version of the Traceo platform.

## Projects
The project overview is a set of screens responsible for a clear representation of data collected by the SDK connected to the software. 

### Navigation
Switching between screens in the project is done from the left sidebar. To view it, click on the Hamburger icon located on the left side in the project header. 

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/sidebar.PNG">

The available options differ in the permissions held in the entire Traceo instance and the role played in the project. Some of the available screens are described below.

### Add new member to project
To add a new user to the project, go to the settings screen and then the Access tab. Click on the **Add** button and fill in the form by selecting the appropriate user from the list and assigning roles to him.

### Member roles
There are three types of roles available to set up for project members.

Privileges due to having a role in the project:
- **Viewer**:
  - review of dashboards, panels, incidents
  - explore logs, metrics and traces
  - changing statuses and assigning members to incidents
  
- **Maintainer**:
  - All viewer privileges
  - adding new members to the project and removing existing ones
  - creating new dashboards and deleting existing ones
  - creating new panels and deleting existing ones
  - generating a new API key
  - renaming the project
  - changing user roles
  
- **Administrator**:
  - All Maintainer privileges
  - deleting the project

### Deleting a project
Only users with administrator roles can delete a project. To do this, go to the project **Settings**, in the **Details** tab at the bottom of the screen there is a **Danger zone** section. After clicking the **Delete** button and confirming with the password, the project will be completely deleted along with all the data collected so far.

## Incidents
An incident is a unique problem (e.g. exception) in your software. Each incident can contain multiple events, each of which describes the occurrence of a specific error.

To view the list of all incidents, select the Incidents option from the Sidebar that slides out on the left.

### Incident states
Each incident has one of three different statuses that should be changed by the project manager as work progresses to eliminate the problem.

- **Unresolved** - status set automatically when a new incident is created or when a new event is received for a given incident. It should be set when no work has been carried out to correct the cause of its occurrence

- **In progress** - status that should be set when work on solving the problem is in progress.

- **Resolved** - status that should be set when work on solving the problem has been completed.

***Please note that when a new event is received for an incident, the status will be automatically updated to Unresolved.***


### Incident details
You can learn more about the incident on the incident details page.

Once an incident is captured by the SDK, all the key information needed by the person responsible for resolving the issue is retrieved.

The most important section on this screen is to graphically show where in the code the exception occurred for each subsequent trace pulled from the entire stack-trace of the exception.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/incident-code.PNG">

It is also possible to view the stack trace in its raw form, i.e. as it was initially captured by the SDK.

The next sections on this screen are the Platform section, which informs us on what type of platform the incident occurred on, and the Information section, where we can manage the status and person assigned to solve the problem or view the time of the first and last occurrence of the incident for this incident.

### Incident analytics

Subpage provides a graphical analysis of the timing of the issues caused by this incident.

Four panels are available:
- **Today** - a graph with an overview of today (from 00:00 to 23:59) showing when errors occurred during today
 
- **Number of errors** - the number of occurrences of a given incident today
 
- **Last seen** - time of the last occurrence of the error today
 
- **Last month** - a graph with an overview of the occurrence of errors in the last month
 
### Incident events

A table with details for each event captured in the currently displayed incident.

## Dashboards
Dashboards are a way to group visualizations of the data you want to see. Each dashboard has panels, each of which is responsible for displaying visualized information.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/v1.2.0/traceo-dashboard.PNG">

After creating a new project, a base dashboard containing information about incidents is automatically created for it. Note that the underlying dashboard cannot be deleted.

Projects can have multiple dashboards. To create a new dashboard (only project administrators and maintainers can do this), click the **Create** button in the top header of the screen and select the **Dashboards** option. After entering the name and accepting it, you will be redirected to a new dashboard.

### Dashboard toolbar

The dashboard toolbar is a collection of tools at the top of the screen that allow you to customize your dashboard. Each option is visible when you have the appropriate permissions for the project.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/dashboard-toolbar.PNG">

Options are available:
- **Add panel** - the ability to add a new panel to the dashboard. (Administrators and Maintainers)

- **Settings** - the ability to change settings for the dashboard, e.g. changing its name (Administrators and Maintainers)
 
- **Lock/Unlock dashboard** - ability to enable or disable the ability to reposition panels in the entire dashboard (Administrators and Maintainers)
 
- **Time picker** - selection of the time period according to which the data on the panels are displayed (Each member of the project)

### Dashboard panel
The panel is the basic visualization element in the dashboard overview.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/v1.2.0/traceo-dashboard-panel.PNG">

At the moment there are three types of panels:
- **Time series** - times series graph is a data visualization tool that illustrates data points at successive intervals of time. Each point on the chart corresponds to both a time and a quantity that is being measured.

- **Histogram** - a histogram is a graphical representation of data points organized into user-specified ranges. Similar in appearance to a bar graph, the histogram condenses a data series into an easily interpreted visual by taking many data points and grouping them into logical ranges or bins.

- **Text** - a panel used to provide textual information using Markdown or HTML

### Create new panel

To create a new panel, select the Add panel option from the dashboard overview view on the toolbar. After selecting this option, a you will be redirected to the screen for creating a new panel.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/panel-edit.PNG">

The new panel creation screen is divided into three sections.

#### Basic visualization options
On the right there is a section with basic information about the visualized data, in which we can choose one of the three possible visualizations. Depending on the selected visualization, possible panel customization options are also displayed.

For time series visualization, these are:
- **Unit** - a unit that determines the values on the Y axis
 
- **Axis** - the ability to manipulate the displayed axes and lines on the grid (dividing lines) and whether the values on the Y axis are to be floating point.
 
- **Tooltip** - setting the visibility of hints after hovering the cursor over the chart.

- **Legend** - setting the visibility of the legend at the bottom of the chart
 
- **Markers** - settings regarding the visibility of points on top of each line included in the chart visualization
 
- **Stack** - settings for the stacked chart. Stacked charts show items stacked on top of each other, highlighted by colored bars or lines. A stacked chart is useful for seeing changes, for example, spending on several products or services added up over time. ***Note that stacked charts do not always represent the data correctly, so be careful when setting this option***. This option is disabled when one of the active series has a different plo type.

For histogram visualization, these are:

- **Histogram** - this section includes:
  - Bucket size - specifying the bucket size for the histogram.
  - Include zero - determine whether values equal to zero should also be used for the histogram.
- **Legend** - setting the visibility of the legend at the bottom of the chart

For text visualization, there are just text section where you can write or paste your markdown or html.

#### Visualization overview
In the central part of the screen there is an overview of the currently created panel. Remember that when creating a new panel, the preview of the visualization will be possible only after its first saving.

#### Visualization datasource series
Datasource series are all the data we want to show in the visualization. If you choose a histogram visualization, you can have only one series, in the case of a time series, you can have many of them, but you cannot use them in the case of text visualizations.

Series customization options:

- **Color** - selection of a color for a given series on the chart by manually entering the HEX color or selecting a color from the palette after clicking on the colored circle on the right.
 
- **Name** - series name should be short
 
- **Description** - a short description of the data presented in this series

- **Field** - the name of the data you want to visualize on this series. Each metric from the SDK such as CPU usage, RAM or any other you define (eq. using [OpenTelemetry](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/opentelemetry-node)) is saved under the appropriate field names. Select the one you need to show on the chart.
 
- **Plot type** - selection of the type of graphical display of data on the chart (bar, line, spline, points)
 
- **Line width** (and **Bar border** width) - width of the border line
 
- **Bar width** - the width of the bar
 
- **Fill area/bars** - setting the area (for line plot) or bar to be filled with color
 
- **Opacity** - transparency setting for the series area

After filling in all the required fields, confirm the creation of a new panel by clicking **Create** on the panel's toolbar.

## Explore
In the Explore screen, you can browse the resources within a given project. Note that in order to be able to view information here, you must first set up the SDK properly. More information can be found [here](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/opentelemetry-node).

The exploration screen allows you to search for three types of data:
- Logs
- Metrics
- Traces

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/explore-toolbar.PNG">

You can select the type using the Select button in the upper left corner of the screen. On the right side of the screen there is a time selector where you can specify the time range for which you want to get the data. The time range cannot exceed 168h (7 days).

### Logs
A log, in a computing context, is an automatically generated and time-stamped documentation of events relevant to a particular system.

An example of how to collect logs using Traceo SDK can be found [here](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/node#logger).

For the exploration of logs, there is a chart with the intensity of log occurrences and in a table with logs found for a given time period. The table can contain up to 2000 logs, so it is important to specify the specific time period in which you want to search for the logs you need.

### Metrics
Metrics are a set of data collected by the SDK in your software and used for extensive analytics, such as the performance of your software. Metrics are collected using the OpenTelemetry library. More information on integration can be found [here](https://github.com/traceo-dev/traceo-javascript/tree/develop/packages/opentelemetry-node).

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/explore-metrics-preview.PNG">

To view the metrics you are interested in, select the appropriate series from the drop-down menu. Each series is colored automatically. 

The visualization of the series you have selected is in the Chart section. To the left of it, you can change the type of chart display. Below the chart there is a table containing the data on which the above chart is based.

### Traces (Beta)
Traces preview is still in beta testing. If you encounter any problem or have an idea to improve the trace view, you can report it [here](https://github.com/traceo-dev/traceo/issues/new).

Tracing is a low-level practice used to profile and analyze application code by developers through a combination of specialized debugging tools and programming techniques. [Read more about traces with OpenTelemetry here](https://lightstep.com/blog/opentelemetry-101-what-is-tracing).

To search for a specific track that interests you the most, you can use the advanced search engine in the expanded Options section. There you will find a number of options for the most narrowed search.

<img src="https://github.com/traceo-io/traceo/raw/develop/.github/screenshots/docs/trace-preview.PNG">

The main trace visualization is in the table below. After clicking on the TRACE ID, its overview will open on the left, containing its details along with a time visualization of the occurrence of traces associated with it.

# SmartLab API - Indoor Automation API

## Introduction

SmartLab API is a project aimed at implementing IoT services similar to smart homes within the lab. The objective is to develop a REST API that provides both monitoring of household appliance statuses and remote control capabilities via the internet. Additionally, the system includes a feature for accessing API documentation when connected to the campus network.

## Core Features

- **Real-time Status Monitoring**: Check the real-time status of devices in the lab
- **Remote Control**: Control devices via the internet
- **Automation Scenarios**: Set condition-based automatic execution rules
- **Usage Analysis**: Analyze device usage patterns and energy consumption
- **Secure Access Control**: Permission-based device access management

## Supported Devices

SmartLab API currently supports the following devices:

- **Lighting Systems**: Smart lighting with brightness and color adjustment
- **Temperature/Humidity Sensors**: Indoor environment monitoring
- **Power Consumption Monitors**: Measuring and analyzing power usage
- **Door Lock Systems**: Remote access control
- **Air Quality Sensors**: Indoor air quality monitoring
- **Projectors/Displays**: Media device control

## Technical Architecture

SmartLab API consists of the following architecture:

1. **Central Control Server**: Node.js-based API server
2. **MQTT Broker**: Real-time communication between devices
3. **Database**: Storage for device states and usage records
4. **Device Agents**: Control software installed on each device
5. **Authentication System**: JWT-based access control

## API Structure

The API consists of the following main endpoints:

- `/api/devices`: Device list and status query
- `/api/devices/{id}/control`: Device control commands
- `/api/scenarios`: Automation scenario management
- `/api/analytics`: Usage statistics and analysis
- `/api/users`: User and permission management

## Use Cases

The main use cases of SmartLab API include:

- **Remote Lab Management**: Check and control lab status from outside
- **Energy Saving**: Reduce unnecessary power consumption
- **Automated Environment Control**: Maintain optimal research/study environment
- **Enhanced Security**: Access record management and notifications

## Implementation Status

Currently, SmartLab API has the following implementation status:

- Basic API endpoints implemented
- Support for more than 5 device types
- Real-time monitoring and notification system established
- API documentation completed through Swagger

## Future Plans

- Add voice control interface
- Machine learning-based usage pattern prediction
- Mobile app development
- Integration with external services (weather, calendar, etc.)

API documentation can be accessed on the campus network at [http://jay.oslab/smartlab](http://jay.oslab/smartlab).

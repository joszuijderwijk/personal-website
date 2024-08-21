---
layout: distill
title: "Smart Traffic Light 1: Setting Up an IoT System"
date: 2021-01-21
description: Setting up an IoT network for a smart traffic light.
tags: iot, mqtt, mosquitto, traffic-light
categories: iot
giscus_comments: true
thumbnail: assets/img/traffic-light-diagram-1.png
toc:
  - name: Introduction
  - name: "Background: The Rowing Ban System"
  - name: Building the IoT Network
  - subsections:
    - name: Understanding MQTT
    - name: Setting Up the Broker
    - name: Implementing Access Control
    - name: Publishing the Rowing Ban Status
  - name: Conclusion and Next Steps
---
{% include figure.liquid loading="eager" path="assets/img/traffic-light-1.png" class="img-fluid rounded z-depth-1" %}

## Introduction

Welcome to the first installment of our smart traffic light series! In this post, we'll explore how to create a simple IoT network for a traffic light system. We'll cover the basics of setting up the network, and in future posts, we'll dive into building a [proof of concept](../traffic-light-2) and a [full-size version](../traffic-light-3) of our smart traffic light.

## Background: The Rowing Ban System

As a member of the _Webcie_ at [A.U.S.R. Orca](http://orcaroeien.nl), a student rowing club, I've been involved in developing and maintaining the club's websites. One of our key projects is the *Member Portal*[^1], which includes a feature for administrators to broadcast rowing bans. These bans indicate whether it's safe or permitted to row, based on factors like weather conditions or scheduled events.

The rowing ban status can be represented by a traffic light system:

- 🟢 Green: No rowing ban
- 🟠 Orange: Partial rowing ban (e.g., only single sculls allowed)
- 🔴 Red: Full rowing ban (no rowing allowed)

Our goal is to create a physical traffic light that automatically displays the current rowing ban status. This tangible representation will serve as an eye-catching and practical addition to the club's information system.

## Building the IoT Network

To bring our smart traffic light to life, we need a robust infrastructure that enables communication between devices. We'll use the [MQTT](https://en.wikipedia.org/wiki/MQTT) (Message Queuing Telemetry Transport) protocol, which is ideal for IoT applications due to its lightweight nature and publish-subscribe model.

### Understanding MQTT

MQTT revolves around a central server called a _broker_, which manages communication between connected devices (clients). Here's a simplified overview of our network:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/traffic-light-diagram-1.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption">
    Figure 1: Schematic overview of the IoT network.
</div>

**Backend**, **Database** and **Frontend** are all components of the previously mentioned member portal. The user (admin) activates a certain rowing ban by pushing a button on the frontend. This triggers an action on the backend, adding the new ban to the database. The frontend now displays the new ban that is stored in the database. These components are specific to the Orca use case and could be replaced by any other system. 

Both **Traffic Light** (our device) and **Backend** (of the member portal) are clients connected to the broker.

MQTT uses _topics_ to organize information. Clients publish messages to specific topics and subscribe to topics they want to receive messages from. For example:
- Publishing topic: `bans/status`
- Subscription topic: `bans/#` (using a wildcard to receive all messages under the "bans" topic)

An important feature of MQTT is the option of *retained messages*. The broker can save the last message sent to a topic, ensuring new clients receive the most recent information upon connecting. This is crucial for rowing bans; otherwise the device would only be able to detect the rowing ban the moment it changes.

### Setting Up the Broker

In the past I've been using [CloudMQTT](https://www.cloudmqtt.com/) for experimenting, but they recently shut down their free plans (cheapest plan is now $5 per month). [MyQttHub](https://myqtthub.com/en), [HiveMQ](https://www.hivemq.com/) and [Flespi](https://flespi.com/mqtt-broker) look promising, although I've never used any of them.

For our project, we'll use [Mosquitto](https://mosquitto.org/), a popular open-source MQTT broker. While there are cloud-based options available, setting up your own broker provides more control and is cheaper in the long run. Setting up your own broker is fairly easy to do, but it requires some configuration and of course your own server. You can find a tutorial on how to do so using Docker [here](https://www.homeautomationguy.io/blog/docker-tips/configuring-the-mosquitto-mqtt-docker-container-for-use-with-home-assistant).


### Implementing Access Control

To secure our system, we'll create three user accounts with specific permissions:

1. **webmaster**: Admin account with full access[^2]
2. **ledenportaal**: Account for the Member Portal
3. **orca**: Account for client devices (e.g., the traffic light)

We'll use an Access Control List (ACL) to restrict these accounts. Here's a sample ACL configuration:

```markdown
# Admin account
user webmaster
topic readwrite #

# Member Portal account
user ledenportaal
topic readwrite vvb/status

# Client devices account
user orca
topic read vvb/status
topic write connection/#
```
[This blogpost](http://www.steves-internet-guide.com/topic-restriction-mosquitto-configuration/) explains ACL for Mosquitto more thoroughly.

### Publishing the Rowing Ban Status

To integrate the rowing ban system with our MQTT network, we used the [MQTTnet](https://github.com/chkr1011/MQTTnet) library in our ASP.NET Core backend. This allows us to publish updates to the broker whenever the rowing ban status changes.

Remember, you could take anything as input for your traffic light! For example, it can display the current rowing ban of your own sports club, [kanikeenkortebroekaan.nl](https://kanikeenkortebroekaan.nl), or just have fun toggling it manually.

## Conclusion and Next Steps

We've now laid the groundwork for our smart traffic light system by setting up an IoT network using MQTT. To recap, we've covered:

1. The concept of using a traffic light to display rowing ban status;
2. MQTT basics and network architecture;
3. Setting up an MQTT broker;
4. Implementing access control for security;
5. Publishing rowing ban updates to the network.

In our [next post](../traffic-light-2), we'll build a prototype of the traffic light, bringing our IoT concept to life. Stay tuned!

---
[^1]: The member portal ("Ledenportaal"), located at [mijn.orcaroeien.nl](https://mijn.orcaroeien.nl), is a private website for members of the club. It's used for boat reservations, articles et cetera.
[^2]: With software like [MQTT Explorer](https://mqtt-explorer.com/) it's really easy to send test messages and have an overview of the traffic that goes through your broker


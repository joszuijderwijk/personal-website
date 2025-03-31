---
layout: post
title: Remotely Controlled Bell
date: 2021-03-24
description: Building a wifi-enabled reception bell using the ESP-01 and a solenoid.
tags: mqtt, bell, plex, iot, esp-01, solenoid
categories: electronics
giscus_comments: true
thumbnail: assets/img/bell-thumb.png
---

{% include figure.liquid loading="eager" path="assets/img/bell.png" class="img-fluid rounded z-depth-1" %}
[![Static Badge](https://img.shields.io/badge/github%20-%20bell-blue?logo=github)](https://github.com/joszuijderwijk/bell)
![Static Badge](https://img.shields.io/github/stars/joszuijderwijk/bell)

## Introduction
After I had implemented phone notifications to update me whenever something new is added to my Plex server ([blogpost](/_posts/2024-12-30-plex-notifications.md)), I started thinking about other ways to keep me notified, preferably something that didn't involve a phone.

A short "tinggg" is a perfect indication that something has been done, so I started looking for reception bells and how to automate them.

I found a blogpost by [Aaron Parecki](https://aaronparecki.com/2017/11/13/5/kickstarter-desk-bell) in which he describes exactly the thing I had in mind! He uses his automated bell for Kickstarter pledge alerts, so that's more or less the same use case. I also found a video by Jeff Geerling, in which he builds a 'bell slapper'.

{% include video.liquid path="https://www.youtube.com/embed/Etr7uIL9spg" class="img-fluid rounded z-depth-1" %}

I wanted my bell to (1) still be completely usable and (2) have no overly noticable changes. Jeff Geerlings solution failed to meet both requirements. Aaron Parecki's solution only met the first, but still requires a huge box on which the bell is mounted. If I could lose the box it'd be perfect.

## Hardware

I always strive to use the cheapest possible c.q. most suitable hardware for the job. A Raspberry Pi, essentially a full-fledged computer, for simply ringing a bell is complete overkill. That said, I don't really have much of a choice, because of the size requirement; my goal is to fit everything inside the bell itself.

Instead of an RPi I went for the legendary ESP-01s, which is about the size of a coin. Below is a complete overview of the parts I used (excl. solder, wires etc). Additionaly, I'd like to point out that 36AWG wire (really really thin) is very useful in combination with the ESP-01 board. If you don't have enough space for headers, you can hook up your ESP with those thin wires and still be able to plug it into your USB programmer.

- ESP-01s
- Reception bell
- 5V Push-pull solenoid
- 5V-3.3V DC-DC Step down converter
- IRLZ44N MOSFET
- 3x 1000µF capacitor
- Phone charger
- 1N4007 diode
- 1kΩ resistor

As for the circuit, I hooked it up the same way as Parecki. The ESP-01s got its power from the step down converter. Don't forget to add the flyback diode, which prevents the GPIO from being damaged. I used poster tack ("kneedgum") to secure components.

While testing the bell with my bench supply, I hadn't included capacitors and everything worked fine. I only found out after testing with a phone charger (rated 2A) that suddenly the solenoid didn't have enough power to ring the bell. This is because a phone charger cannot provide enough inrush current at once. To tackle this, I added three 1000µF capacitors in parallel between 5V and GND. It barely fitted, but it worked.

<div style="display: flex; justify-content: space-between;">
  <img src="/assets/img/bell-inside-1.jpeg" alt="Inside View 1" style="width: 48%; border-radius: 8px;">
  <img src="/assets/img/bell-inside-2.jpeg" alt="Inside View 2" style="width: 48%; border-radius: 8px;">
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/bell-inside.mp4" class="img-fluid small-img rounded z-depth-1" controls=true %}
    </div>
</div>


## Software

The software driving the bell is very straightforward. As most of my projects, it includes the [WiFiManager library](https://github.com/tzapu/WiFiManager), which creates a captive portal to set up your WiFi credentials and of which I am very fond. It also makes use of MQTT ([PubSubClient](https://github.com/tzapu/WiFiManager)). Using this protocol everything is updated directly and there is no need for polling. If something new is added to my Plex server, the bell will ring instantenously!

Note that MQTT is of course not required. It is also possible to run a webserver, or poll some website directly. I personally like connecting all my devices to my home network using MQTT, because it makes it easier to control everything centrally.

The full code is [publicly available](https://github.com/joszuijderwijk/bell).

## Result

Just for fun, I wanted the option to control the bell easily by phone (primarily to annoy my roommates hehe). For that purpose, I used [MQTT Dash](https://play.google.com/store/apps/details?id=net.routix.mqttdash&hl=nl&gl=US), which is a free Android app that enables you to create a dashboard to send / retrieve MQTT messages.

I filled in my broker's details and hooked up a button block to publish "tring" to `bell/input` (that's the command the bell listens for) and a text block to subscribe to the `connection/bell` topic (which then displays "0" as "OFFLINE" and "1" as "ONLINE").

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="../../assets/video/bell.mp4" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

![MQTT Dashboard](/assets/img/mqtt-dashboard.jpeg)
*Figure 2: MQTT Dashboard*

At last, I hooked the bell up to my exisiting Node-RED flow that handles the notifications for new media on my Plex server. The red box in Figure 3 indicates the flow that is responsible for the bell.

![Adjusted Node-RED Flow](/assets/img/flow-2.png)
*Figure 3: Adjusted Node-RED Flow*

You can see the final product in action below!

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="https://www.youtube.com/embed/tXk-c-Hw8Pc" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="../../assets/video/bell.mp4" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
---
layout: post
title: Image Push Notifications for Plex 
date: 2024-12-30
description: Get push notifications with images for your Plex setup.
tags: android, plex, tautulli
categories: software
giscus_comments: true
thumbnail: assets/img/plex-notification-thumb.png
---

{% include figure.liquid loading="eager" path="assets/img/plex-notification.png" class="img-fluid rounded z-depth-1" %}

I’ve been using [Plex Media Server](https://www.plex.tv/media-server-downloads) for years to manage and stream my personal movie collection — it’s basically my own private Netflix. Super convenient, especially since major streaming services regularly remove titles (and keep asking for more money). To keep an eye on stats like what’s being watched and by whom, I also run [Tautulli](https://tautulli.com/). Like many Plex users, I use tools like [Radarr](https://radarr.video/) and [Sonarr](https://sonarr.tv/) to help organize and automatically track new content I’ve added from my physical media or other legal sources. It’s fun to get instant notifications when something shows up — like “The Room (2003) has just been added! 🍿” (or even trigger a real hotel bell to ring! 🛎️ Check out this [blogpost](../bell)).


I couldn't get notifications with images working properly using built-in functionality of the Tautulli app. Some others online had the same issue, so in early 2021, I wrote an [article](https://archive.is/pmH6P) about how to build this feature yourself. For that, I used FireNotify, the OMDb API, Node-RED, and MQTT. Let's say that's a bit overkill. In this article, I'll provide a simpler option to achieve this without all that complexity using notification services. 

Specifically, we want to set up push notifications on Android that display both poster art and titles whenever new media is added to the Plex library. We'll accomplish this using just two tools: Tautulli and a service called _Pushover_. As a bonus, Pushover can include IMDb links directly in the notifications!

## Pushover vs Pushbullet
[Pushover](https://pushover.net/) is a system that lets you easily send real-time push notifications to Android, iPhone/iPad, and Desktop Browser clients. [Pushbullet](https://www.pushbullet.com/) offers a similar service. Here's a quick comparison:

* **Pushbullet** has a free version with 500 messages per month and a Pro version with unlimited messages. It only works with Android and Chrome but offers useful features like mirroring notifications between phone and PC.

* **Pushover** costs a one-time fee of $5 per platform with a limit of 10,000 messages per month per app. It supports more operating systems (Android, iOS, and Chrome) and has additional options like custom sounds and priorities, such as messages that keep repeating until you acknowledge them.

The good news is that both are integrated with Tautulli, so it depends on your preference which one you use. If you have an Android phone and stay under 500 notifications per month, Pushbullet is the free option. I use Pushover because I might want to use more notifications in the future.

## Set-up
We only need to follow a few simple steps: installing Pushover and connecting it to Tautulli.

1. Create an account via [pushover.net](https://pushover.net/);
2. This automatically gives you a _User key_;
3. Install the Pushover app (Android / iOS) and link it with the code from (2);
4. Log in at [pushover.net](https://pushover.net/) and add an Application/API Token under **Your Applications**. Name it "Tautulli" or something similar. This generates a new _API key_ specifically for this application.

You can easily test if notifications arrive on your phone through the web interface. Now that the Pushover installation is complete, we can set up Tautulli. Fortunately, this is very simple.

{:start="5"}
5. Log in to your Tautulli web interface and go to **Settings > Notification Agents**.
6. Add a new Pushover (or Pushbullet) agent.
7. Fill in the fields **Pushover API Token** (from step 2) and **Pushover User or Group Key** (from step 4).
8. Check the **Include Poster Image** checkbox.
9. Under **Movie Link Source**, select **IMDB**.
9. Under **Triggers**, check the **Recently Added** checkbox.
10. You can then customize the notification text via **Text** under the **Recently Added** section.

You can test if your Tautulli notifications arrive on your phone here (**Test Notifications**).

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/notification-example.png" class="img-fluid small-img rounded" zoomable=true width="50%" %}
    </div>
    <span><em>An example of a notification.</em></span>
</div>
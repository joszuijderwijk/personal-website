---
layout: post
title: Display the state of your IoT Device in WordPress
date: 2021-03-23
description: Display real-time IoT device status in WordPress using MQTT and Node-RED.
tags:
- iot
- wordpress
- mqtt
categories: software
giscus_comments: true
thumbnail: assets/img/iot-wp-thumb.png
---

{% include figure.liquid loading="eager" path="assets/img/iot-wp.png" class="img-fluid rounded z-depth-1" %}

## Introduction  
When I set up this site [my [old WordPress website!](https://archive.is/2DDTB)], I was wondering if there was an easy way to display the current state of a smart system as a widget. Since WordPress has a plethora of plugins, I assumed there would be a plugin for this task. However, that wasn't the case, so I had to come up with my own solution.

Before diving into the WordPress integration, let me briefly explain MQTT. MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol specifically designed for IoT (Internet of Things) devices. It uses a publish/subscribe model where devices can publish messages to specific topics, other devices or applications can subscribe to these topics to receive updates, and a central broker handles message distribution. MQTT is ideal for IoT applications because it has minimal bandwidth requirements, works well on unreliable networks, enables real-time communication, and allows one-to-many message distribution. In my smart home setup, I use MQTT as the standard communication protocol for all my IoT devices, including the coffee machine in this example.

As a proof of concept, I wanted to display the current state of my coffee machine that I had connected to MQTT (I might write another blogpost about this project in the future). I modified the coffee machine to publish its state (1 when brewing, 0 when idle) to an MQTT topic called "coffee/status". My WordPress widget needed to:

- Connect to the MQTT broker (the central server handling all MQTT messages)
- Subscribe to the "coffee/status" topic where the coffee machine publishes its state  
- Change its appearance in real-time based on the coffee machine's state  

<div class="alert alert-primary" role="alert" markdown="1">
ℹ️ This post describes my original WordPress implementation. On my current Jekyll site, I use a simpler approach: the static frontend sends a GET request to a small Node-RED HTTP endpoint, and Node-RED returns the current IoT state directly. This is closer to the approach I later used for the [poke button](poke). 
</div>

## Two Approaches: Modify a Plugin or Use a Bridge  
Initially, I searched for WordPress plugins that could connect to an MQTT broker and found a few:

- **WP-MQTT** – Designed for publishing messages, not subscribing. Useful, but not what I needed.  
- **DIOT SCADA with MQTT** – Looked promising but hadn't been updated in years. Also, it lacked a way to inject credentials.  
- **Various WooCommerce plugins** – Mostly for e-commerce automation, so not relevant.  

Since **DIOT SCADA with MQTT** seemed like the best fit, I tried modifying it to add support for authentication.

### Option 1: Modifying the WordPress Plugin  
WordPress makes it easy to edit plugin code, so I went into the Plugin Editor and modified **js/eds_mqttsub.js**. Support for mqtt credentials was already built in the underlying library. I only had to change this:

```javascript
connOpt = { onSuccess:onConnect };
```

to this:

```javascript
connOpt = {
    userName: "...",
    password: "...",
    onSuccess:onConnect
};
```

This worked, but there was a security issue: JavaScript files are loaded in the browser, **exposing the credentials**. A safer approach would be retrieving them via PHP, like the server/port settings. It's also best practice to restrict the MQTT user to **ReadOnly** using [ACL](http://www.steves-internet-guide.com/topic-restriction-mosquitto-configuration/). However, for testing, this was fine.

The plugin used the [Paho library](https://eclipse.dev/paho/), which connects to MQTT over WebSockets. I could have built my own implementation, but this plugin saved time. After setting the host, port, and client ID, I tested it with:

```
[diot topic="coffee/status"]
```

This returned the correct value! However, I quickly ran into another issue... Every page load created a new MQTT connection. Since I was using CloudMQTT's free plan (limited to **10 connections**), this was inefficient[^1]. Instead of modifying the plugin further, I opted for a more scalable approach:

## Option 2: Using Node-RED as a Bridge (Recommended)  
A bridge allows WordPress to display the MQTT state **without** requiring every visitor to open an MQTT connection. This avoids performance issues and potential rate limits. It also requires a backend set-up. This could for example be in the form of a very simple PHP script on your WP server, or Home Assistant. I chose to build a simple flow in Node-RED, as I was already running that service. The main idea is to:

1. Set up a WordPress REST API endpoint 
2. Use Node-RED to monitor the MQTT topic  
3. Send updates to WordPress when the state changes

### Step 1: Creating a WordPress REST API Endpoint  
WordPress includes a REST API, which allows external applications to interact with it. I used the **Ultimate Endpoints with REST API** plugin to create an endpoint.  

1. Add a new API Secret (a full name + email address).  
2. Specify a base name (I used "iot").  
3. Now, we have an endpoint!  

Next, I added the following function to `functions.php` to handle requests:

```php
// IoT Callback
add_filter("wcra_iot_callback", "wcra_iot_callback_handler");	
function wcra_iot_callback_handler($param) {
    $response = "changed from " . get_option('coffee') . " to " . $param['coffee'];
    update_option('coffee', $param['coffee']);
    return $response;
}
```

This updates the **coffee** option in WordPress whenever the endpoint is called. Note that the name of the base should be in the filter hook, i.e. wcra_**iot**_callback.



### Step 2: Displaying the Coffee Machine State in WordPress  
To show the state, I used the [XYZ PHP Code](https://nl.wordpress.org/plugins/insert-php-code-snippet/) plugin and added this snippet:

```php
<?php
$coffee = get_option('coffee') == 1 ? "coffee-enabled" : "coffee-disabled";
$tt = get_option('coffee') == 1 ? "Currently making coffee!" : "Currently not making coffee.";
echo "<div class=\"tooltip\"><svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\" enable-background=\"new 0 0 1000 1000\" xml:space=\"preserve\" class=\"$coffee\">
<g><path d=\"M888.6,331c0-28.2-9.9-52.1-29.6-71.8c-19.7-19.7-43.7-29.6-71.8-29.6h-33.8v202.8h33.8c28.2,0,52.1-9.9,71.8-29.6C878.8,383.1,888.6,359.2,888.6,331z M10,736.6h946.2c0,37.3-13.2,69.2-39.6,95.6c-26.4,26.4-58.3,39.6-95.6,39.6H145.2c-37.3,0-69.2-13.2-95.6-39.6C23.2,805.7,10,773.9,10,736.6L10,736.6z\"/></g>
</svg><span class=\"tooltiptext\">$tt</span></div>"
?>
```

This can be added via shortcode:

```
[xyz-ips snippet="coffee"]
```
I added additional styling to make sure the icon changed colors and had the appropriate size. 

### Step 3: Setting Up Node-RED  
Instead of polling MQTT on every page load, Node-RED listens for changes and sends updates to WordPress. The flow looks like this:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/flow1.png" class="img-fluid small-img rounded" zoomable=false %}
    </div>
</div>
```json
[
    {"id":"mqtt-in","type":"mqtt in","topic":"coffee/status","broker":"mqtt-broker","wires":[["function-node"]]},
    {"id":"function-node","type":"function","func":"msg.payload = {\"coffee\" : msg.payload}; return msg;","wires":[["http-request"]]},
    {"id":"http-request","type":"http request","method":"POST","url":"https://your-site.com/wp-json/wcra/v1/iot/?secret_key=???","wires":[[]]}
]
```

Now, whenever the coffee machine changes state, Node-RED updates the WordPress database instantly!

## Conclusion  
This works beautifully! One minor drawback is that the state isn't updated in real time: you only see changes when you refresh the site. This would not be the case in the approach described at the beginning of this post. However, I don't see it as a problem for this particular use. Our approach keeps the MQTT communication separate from WordPress while still allowing real-time updates of device states on the website.

In my smart home setup, this solution works well not just for the coffee machine but could be extended to any IoT device that communicates via MQTT. The same principles apply whether you're monitoring smart lights, temperature sensors, or other connected devices.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="https://www.youtube.com/embed/BjFpE5LbSZY" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

[^1]: I strongly recommend hosting your own MQTT broker, check out [Mosquitto](https://mosquitto.org/).
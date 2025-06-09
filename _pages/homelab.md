---
layout: page
permalink: /homelab
title: "Homelab"
description: "My current homelab server setup."
pretty_table: true
---

I've been running a self-hosted server for a while now as a hobby. This page contains my current setup, both for my own reference and to share with others who might be interested in building something similar. Occassionally I write a [blogpost](../blog/tag/self-hosting/) about selfhosting projects.

### ⚙️ Hardware

| Component | Model |
|-----------|-------|
| CPU | AMD Ryzen 3 2200G with Radeon Vega Graphics |
| Motherboard | ASUS Prime B450M-A |
| RAM | 16GB (2x8GB) DDR4 2400MHz |
| Primary Storage | WD 240GB WDS240G2G0B SSD |
| Media Storage | 2TB WDC WD20EFRX + 4TB WDC WD40EFRX + 2x 6TB WDC WD60EMAZ |
| Network | Realtek RTL8111/8168 Gigabit Ethernet |
| Graphics | Integrated AMD Radeon Vega |
| Case | Corsair Carbide Air 240 (Black) |
| Power Supply | Corsair VS350 (80Plus) |


### 📦 Software

I'm running all my services in Docker containers (`docker compose`) on an Ubuntu server. On this page you'll find a (rather large) selection of what I am currently running.

#### Media Stack

My media server setup consists of several interconnected services:

| Service | Description |
|---------|---------|
| [Plex](https://github.com/linuxserver/docker-plex) | Personal Netflix |
| [Radarr](https://github.com/linuxserver/docker-radarr) | Manages my movies |
| [Sonarr](https://github.com/linuxserver/docker-sonarr) | Manages my series |
| [Readarr](https://github.com/linuxserver/docker-readarr) | Manages my e-books |
| [Bazarr](https://github.com/linuxserver/docker-bazarr) | Manages subtitles |
| [Calibre](https://github.com/linuxserver/docker-calibre) + [Calibre-Web](https://github.com/linuxserver/docker-calibre-web) | For accessing my e-books |
| [Tautulli](https://github.com/linuxserver/docker-tautulli) | Stats for Plex |
| [SABnzbd](https://github.com/linuxserver/docker-sabnzbd) | Usenet downloader |
| [Prowlarr](https://github.com/linuxserver/docker-prowlarr) | Manages indexers for the *arr apps |
| [qBittorrentVPN](https://github.com/MarkusMcNugen/docker-qBittorrentvpn) | For torrent downloads (with built-in VPN protection) |
| [Huntarr](https://github.com/plexguide/Huntarr.io) | For discovering missing items |
| [Cleanuperr](https://github.com/flmorg/cleanuperr) | Removes unwanted or blocked files |

#### Other services

Beyond media, these services handle everything from networking to automation.

| Service | Description |
|---------|-------------|
| [Nextcloud](https://github.com/nextcloud) | Personal DropBox |
| [Nginx Proxy Manager](https://github.com/NginxProxyManager/nginx-proxy-manager) | Network configuration |
| [Node-RED](https://github.com/node-red/node-red) | Home automation flows |
| [Umami](https://github.com/umami-software/umami) | Privacy-focused analytics for my websites |
| [Mosquitto](https://github.com/eclipse-mosquitto/mosquitto) | Home automation communication (MQTT broker)|
| [Watchtower](https://github.com/containrrr/watchtower) | Updates containers |
| [phpMyAdmin](https://github.com/phpmyadmin/docker) | Manages databases |
| [Kutt](https://github.com/thedevs-network/kutt) | Link shortener ([jos.to](https://jos.to))|

#### Static websites

I've also got a few websites running, e.g., [ledlijstje.nl](https://ledlijstje.nl), [barrybox.nl](https://barrybox.nl), [kratjes.net](https://kratjes.net), each using their own nginx/php container (or using Nginx Proxy Manager).

---

_Last updated: June 2025_

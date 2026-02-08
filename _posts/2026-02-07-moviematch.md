---
layout: post
title: MovieMatch for Plex
date: 2026-02-07
description: An app that helps you pick a movie democratically.
tags:
- plex
categories: software
giscus_comments: true
thumbnail: assets/img/moviematch-thumb.png
---
{% include figure.liquid loading="eager" path="assets/img/moviematch-header.png" class="img-fluid rounded z-depth-1" %}
[![Static Badge](https://img.shields.io/badge/github-MovieMatch-blue?logo=github)](https://github.com/joszuijderwijk/MovieMatch)
[![Docker Pulls](https://img.shields.io/docker/pulls/iovidius/moviematch?label=Docker+Hub)](https://hub.docker.com/repository/docker/iovidius/moviematch)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/joszuijderwijk/moviematch?label=Latest+release)](https://github.com/joszuijderwijk/moviematch/releases)

The other day, I stumbled upon *MovieMatch*, an open-source project that makes choosing a movie from your collection a democratic process. MovieMatch connects to your Plex server and turns your movie library into a Tinder-style experience: swipe right if you want to watch a movie, swipe left if you don't. When multiple people swipe right on the same movie, it becomes a match, and the best-matched movies float to the top.

Personally, I enjoy the process of discussing every option and watching trailers endlessly. Picking a movie often comes with FOMO; choosing one always means not choosing all of the other candidates.

---

Below are two screenshots of the mobile view of the app, presenting a rather tempting movie option.

<div class="row mt-3">
    <div class="col-sm-6 mt-3 mt-md-0" style="width:50%;">
        {% include figure.liquid path="assets/img/moviematch-screenshot-1.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-sm-6 mt-3 mt-md-0" style="width:50%;">
        {% include figure.liquid path="assets/img/moviematch-screenshot-2.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>


### Features
The app lets you create rooms that you can share with your friends via a link. When creating a room, you can already preselect which movies will appear (for example, unwatched titles or movies with an IMDb score above 6).

In my fork — built on top of the original project by LucasChanning and an improved fork by dhicock — I added several improvements:

- **Trailer button** in the movie detail view, so you can quickly check a trailer before committing 
- **External ratings support** (IMDb / Rotten Tomatoes when available via Plex metadata)
- **More detailed movie cards**, showing additional metadata at a glance
- Improved translations and UI text
- **Prebuilt Docker images**, published to Docker Hub and GHCR for easy deployment

### Installation with Docker

Getting MovieMatch running is very straightforward. Below is a minimal `docker-compose.yml` example:

```yaml
version: '3'
services:
  moviematch:
    image: iovidius/moviematch:latest # or ghcr.io/joszuijderwijk/moviematch:latest
    container_name: moviematch
    environment:
      PLEX_URL: "PLEXURL"
      PLEX_TOKEN: "TOK"
    ports:
      - 8000:8000
```

You can obtain your Plex token, `X-Plex-Token`, in an easy though slightly clunky way ([tutorial](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token)).

To be able to connect to the app remotely you need a reverse proxy. Personally I use [Nginx Proxy Manager](https://nginxproxymanager.com/). This also makes it easy to add basic authentication to your website, so other people can't meddle with your (possibly already heated) movie discussions.

---
Have fun! 🍿 Also feel free to improve this project with even more features (pick one movie at random? Max number of swipes?)
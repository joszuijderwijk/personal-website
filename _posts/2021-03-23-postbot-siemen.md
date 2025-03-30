---
layout: post
title: Postbot Siemen
date: 2021-03-23
description: Een Twitterbot gebaseerd op Postbode Siemen.
tags: dutch, gesodemieter
categories: software
giscus_comments: true
thumbnail: assets/img/siemen-thumb.png
---
{% include figure.liquid loading="eager" path="assets/img/siemen.png" class="img-fluid rounded z-depth-1" %}
[![Static Badge](https://img.shields.io/badge/github%20-%20postbotsiemen-blue?logo=github)](https://github.com/joszuijderwijk/postbotsiemen)
![Static Badge](https://img.shields.io/github/stars/joszuijderwijk/postbotsiemen)


[@PostbotSiemen](https://x.com/PostbotSiemen) is een Twitterbot gebaseerd op niemand minder dan Postbode Siemen uit de nostalgische televisieserie [Zaai](https://nl.wikipedia.org/wiki/Zaai). De bot is open source en ooit gemaakt voor een opdracht voor de Universiteit Twente. Hij wordt niet meer onderhouden en is ook niet meer online. Maar ik vond het idee nog wel aardig om hier te delen.


Postbot Siemen kan de volgende dingen:

1. Tweets van en naar de geheimtaal Wokkie Tokkie vertalen, e.g. "hokkie 1 lokkie lokkie 4" correspondeert met "hallo";
2. Iedere week een Siemen-quote tweeten;
3. Mensen die zich vervelen voorzien van een YouTube filmpje naar een aflevering van Zaai.

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="https://www.youtube.com/embed/uQf88h1ludk" class="img-fluid rounded z-depth-1" %}
    </div>
</div>


De bot reageert op iedere mention. Hij filtert de tweets op basis van bepaalde matches van reguliere expressies. De regex van een zin in WokkieTokkie ziet er bijvoorbeeld zo uit: `(([a-z]okkie(\s)*)|[12345](\s)*)+`

Hier een paar voorbeelden van interacties:

{% raw %}
Siemen stuurt een YouTube filmpje.
<blockquote class="twitter-tweet">
 <a href="https://twitter.com/PostbotSiemen/status/1362077765957279744">February 17, 2021</a>
</blockquote>

Siemen vertaalt een woord naar Wokkie Tokkie.

<blockquote class="twitter-tweet">
<a href="https://twitter.com/PostbotSiemen/status/1361791203927293963">February 16, 2021</a>
</blockquote>

Siemen ziet dat een reactie het maximale aantal tekens van een tweet overschrijdt. Daarnaast ligt het sowieso niet in Siemens aard om ellelange vertalingen te geven.
<blockquote class="twitter-tweet">
 <a href="https://twitter.com/PostbotSiemen/status/1362076742790361089">February 16, 2021</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{% endraw %}




---
layout: default
title: Polski
permalink: /blog/pl/index.html
---
# Posty
{% for post in site.tags.pl %}
<time>{{ post.date | date: "%Y-%m-%d" }}</time>
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<br />
{% endfor %}
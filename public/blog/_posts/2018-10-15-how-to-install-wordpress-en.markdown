---
layout: post
title:  "About how to configure project which we are going to test"
date:   2020-07-26 23:03:00 +0200
categories: jekyll
tags: en
---

# Introduction

I were looking for a software where I could show examples of automation of
application which display graphic interface and API. Also it should be free. I
found such a project:

# Docker
I've tried install docker via brew, however without success. So I had fallback
to get started instruction on official site:

    https://www.docker.com/get-started

After successful installation execute a command in terminal:

    docker --version

Correct output should be:

    Docker version 18.09.2, build 6247962

# Project

Let's move to 'server' directory in our project, next execute in terminal:

    docker build -t fullstack-server .

Afterwards:

    docker run -d fullstack-server


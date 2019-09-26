---
layout: post
title:  "O tym jak skonfigurować projekt który zamierzamy testować"
date:   2020-07-26 23:03:00 +0200
categories: jekyll
---

# Wstęp

Krótkie wytłumaczenie, potrzebowałem softu na którym będę mógł pokazać przykłady automatyzacji na
aplikacji która wystawia interfejs graficzny jak i API, a do tego jest darmowa. Znalazlem taki projekt: 

# Docker
Próbowałem zainstalować dockera poprzez brew, jednak bez powodzenia. Pozostaje więc get started na stronie dockera:

    https://www.docker.com/get-started

Po poprawnej instalacji uruchom takie polecenie w terminalu:

    docker --version

Poprawny output powinien wyglądać tak:

    Docker version 18.09.2, build 6247962

# Projekt

Przechodzimy do katalogu 'server' w katalogu z projektem, nastepnie uruchamiamy w terminalu:

    docker build -t fullstack-server .

Nastepnie:

    docker run -d fullstack-server

    
---
layout: post
title:  "Jak chciałbym aby wyglądał proces testowy w projektach nad którymi pracuję"
date:   2019-12-08 08:00:00 +0200
categories: [testautomation, testprocess]
tags: [testautomation, testprocess]
permalink: /cypress-6
ogimage:
  - TODO
ogimagetype:
  - image/png
ogdescription:
  - TODO
---

## Wstęp

Miałem ostatnio okazję zastanowić się nad tym jak wyobrażam sobie idealny proces testowy. Jak każdy mam swoje przemyślenia i opinie na ten temat, pewnie lepsze lub gorsze. Stwierdziłem że muszę je usystematyzować. Zapraszam do czytania i komentowania. :)

Poprzedni post w tej tematyce znajdziesz tutaj: [Porządki, usystematyzowanie adresów URL]({% post_url 2019-11-11-urls %})

{% include_relative subForm.markdown %}

## Podstawa

Osobiście uważam, że: 

_Głównym aspektem budowania jakości w projekcie jest szybki feedback dotyczący zmian w kodzie aplikacji_.

Tradycyjny model wytwarzania oprogramowania jest odwrotnością zdania które napisałem powyżej. Zespoły kiedyś, a często nawet dzisiaj, korzystały z manualnych metod weryfikacji oprogramowania. Testy zaczynały się dopiero po fazie wytwarzania oprogramowania rozumianego poprzez programowania aplikacji przez programistów. To podejście ma kilka minusów:

 * manualna regresja jest czasochłonna i kosztowna. W konsekwencji oznacza to, że ten krok staje się wąskim gardłem w procesie
 * manualne testowanie nie jest wiarygodne z prostego powodu - ludzie są słabi w powtarzalnych zadaniach, takie jak wyżej wspomniane testy regresji.
 * ciężko jest przewidzieć zmiany w kompleksowym systemie, przez co wręcz niemożliwym jest odpowiednie wycelowanie testami manualnymi które odbędą się w rozsądnym czasie, w obszary które mogły ulec zmianie
 * utrzymanie dokumentacji które jest wymagane dla odpowiedniego przeprowadzenia testów manualnych jest ciężkie w wykonaniu i niemożliwe po pewnym czasie i wielkości projektu w rozsądnym czasie. Nawet jeśli uda Ci się to zrobić, czy nie lepiej w tym czasie testować lub dbać o jakośc w innych obszarach?

## Jak automatyzować

Po przeczytaniu pierwzego akapitu można ulec wrażeniu że jestem przeciwko testowaniu manualnemu. Nic z tych rzeczy, jestem zdania że ludzie powinni się skupić na tym, w czym są najlepsi - kreatywną pracą. Powtarzalną pracę zostawmy dla robotów. Dlategpo też aby skutecznie wdrożyć automatyzację musimy rozwijać testy automatyczne jak i również te manualne.

Testy automatyczne powinny zawierać:
* Testy jednostkowe - sprawdzają pojedyńcze moduły kodu, metody, funkcje, klasy w izolacji. Zapewniają również wysoką testowalność kodu. Bez tego elementu testowanie na wyższych poziomach staję się niezwykle utrudnione i pozostawia nam jedynie sceanriusze pełnego end to end.
* Testy akceptacyjne - 

## Podsumowanie

{% include_relative leadmagnet.markdown %}
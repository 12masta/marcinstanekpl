---
layout: post
title:  "Test automation boilerplate"
date:   2020-11-01 18:03:22 +0200
categories: selenium
---

## Wstęp

Tytuł po angielsku, tekst po polsku. Na dluzsza mete nie da sie inaczej wiec trzeba sie pogodzic z polenglishem. Do rzeczy, ostatnio starałem się o zdobycie nowego klienta, jako jedno z zadań które miały uduwodnić moje zdolności było wykonanie szybkiego prototypu frameworka testowego. Z tej okazji zamierzam Wam pokazać jak podchodzę do takiego problemu. Przy okazji dac Wam odrobine wartosci.

Zaczynamy od boilerplate, to taka podstawa frameworku testowego, w pewien sposób szkielet naszego programu który mozemy, a nawet powinnismy uzyc w przyszlosci.

## Narzędzia

Uzyjemy do tego:

* Java, język programowania
* Groovy, drugi język, nie ma się czego obawiać ;)
* Spock Framework, biblioteka dzięki której zaprojektujemy testy
* Maven, budowanie i zarządzanie zaleznosciami
* i dopiero Selenium WebDriver, biblioteka do testowania UI
* IntelliJ, IDE

## Tworzenie projektu

Otwieramy IDE, wybieramy Create New Project. Pojawia nam sie okno, wybieramy Maven. Upewniamy sie ze mamy ustawiony Project SDK. Zaznaczamy Groovy, klikamy Next. Następnie nadajemy nazwę dla naszego projektu. Ja nafaje nazwę dla GroupId:

    com.szkolqa

ArtifactId:

    mavenspockseleniumwebdriverboilerplate

Pole Version pozostawiam bez zmian, klikam Next.

Ja uzywam auto importu. Klikam Next a następnie Finish.

Projekt został utworzony.

Usuwamy katalog src poniewaz potrzebujemy bardziej zlozonej struktury aby lepiej zorgranizowac moduly wewnatrz projektu.

Dodajmy nowy moduł do projektu o nazwie testframework. W przyszlosci umiescimy tu pliki przechowujace logike testow.

Dodajemy kolejny modul, mozemy nazwac go tests. W tym miejscu stworzymy testy dla naszej aplikacji.

Drzewo projektu po tych wszystkich operacjach powinno wygladdac w ten sposob:


## Zaleznosci

Uzyjemy nastepuajcych zewnwtrznych bibliotek aby ulatwic sobie prace.

Przechodzimy do pom.xml w module tests i nastepeni dodajemy sekcje w wezle <modules>:

# selenium-java

biblioteka do testowania UI

        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>3.14.0</version>
        </dependency>

# Spock framework

Framework do tworzenia testow i specyfikacji, przeznaczony dla apliakcji napisanych w Javie i Groovy. 

        <dependency>
            <groupId>org.spockframework</groupId>
            <artifactId>spock-core</artifactId>
            <version>1.1-groovy-2.4</version>
        </dependency>

# spock-retry

Uzyteczne dla testow e2e, w przypadku faila powtarza testy N, okreslona przez nas razy. Jak wiemy ze stabilnoscia testow w Selenium WebDriver bywa roznie dlatego warto rozwazyc dodanie tej biblioteki.

        <dependency>
            <groupId>com.anotherchrisberry</groupId>
            <artifactId>spock-retry</artifactId>
            <version>0.6.4</version>
        </dependency>

# webdrivermanager

Biblioteka ktora pomaga zarzadzac binarkami driverow dla Selenium WebDirver. Dosyc swieza biblioteka, uzywam od opoczatku 2018 roku w komercyjnym projekcie. Jak dla mnie ok, polecam.

        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>3.0.0</version>
        </dependency>
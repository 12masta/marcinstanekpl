---
layout: post
title:  "Testy logowania z Cypress"
date:   2019-10-02 10:03:22 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress]
---

## Wstęp

Dzisiaj na stół biorę pozornie proste testowanie logowania się uzytkownika do aplikacji. Myślę jednak ze mimo to, sporo sie nauczysz po przeczytaniu tego posta.

Poprzedni post znajdziesz tutaj: [Zapoznanie się z Cypress]({% post_url 2019-10-01-first-tests-with-cypress %})

## Krok pierwszy

Lecimy z kodem!

![1-coding](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F1-coding.mp4?alt=media&token=b85589b4-8ada-4feb-9011-eaa95b1dcfd3)

Nie, najpierw przygotujemy przypadki które zostaną zautomatyzowane.

Osobiście preferuje rozpisywanie przypadków w następujący sposób:

**Preconditions:**

* 

**Steps:**

1. 

**Expected results:**

* 

Nie tłumaczę tego, kod i specyfikacja będzie po angielsku. Przypadki nie są skomplikowane, ale to w końcu tylko logowanie.

### Successfull login

**Preconditions:**

* User exists
* User at /login

**Steps:**

1. Type correct Email
1. Type correct Password
1. Click Sign in button

**Expected results:**

* Successfuly logged in
* Redirected to base url

### Incorrect password

**Preconditions:**

* User exists
* User at /login

**Steps:**

1. Type correct Email
1. Type incorrect Password
1. Click Sign in button

**Expected results:**

* Should not be logged in
* Should stay at /login
* Validation error: Error Invalid email / password.
* Fields should not be cleared out

### Not existing user

**Preconditions:**

* User should not exists
* User at /login

**Steps:**

1. Type valid Email
1. Type some Password
1. Click Sign in button

**Expected results:**

* Should not be logged in
* Should stay at /login
* Validation error: Error Invalid email / password.
* Fields should not be cleared out

### Empty fields

**Preconditions:**

* User at /login

**Steps:**

1. Click Sign in button

**Expected results:**

* Should not be logged in
* Should stay at /login
* Validation error:
'Email' must not be empty.
'Password' must not be empty.
* Fields should not be cleared out

## Implementacja pierwszego testu

Kiedy wiadomo juz co chcemy zrobic, mozna zabrac sie za tą ciekawsza czesc. ;)

Tworzę nowy plik o nazwie: 

    LoginTests.spec.js 

w katalogu:

    ../cypress/integration/LoginTests.spec.js

Bierzemy się za implementację pierwszego testu - Successfull login. Na początek zaczynam pracę z uytkownikiem którego utworzyłem ręcznie za pomocą formularza rejestracji. Kod wygląda następująco:

    describe('Login Tests', function () {
        it('Successfull login', function () {
            cy.visit('http://localhost:4100/login')

            cy.get(':nth-child(1) > .form-control')
            .type('test@test.com')

            cy.get(':nth-child(2) > .form-control')
            .type('test')

            cy.get('.btn')
            .click()

            cy.url()
            .should('contain', 'http://localhost:4100/')
            cy.get(':nth-child(4) > .nav-link')
            .should('have.attr', 'href', '/@test')
            cy.get(':nth-child(3) > .nav-link')
            .should('have.attr', 'href', '/settings')
            cy.get('.container > .nav > :nth-child(2) > .nav-link')
            .should('have.attr', 'href', '/editor')
        })
    })

Totalnie mi się on nie podoba, jest tu wiele do poprawy, ale na refaktoryzacje przyjdzie jeszcze czas. Test spełnia swoją rolę, wypełnia formularz logowania, zatwierdza go i sprawdza warunki opissane w przypadku testowym. Metody typu .type(), .get(), .click(), są juz znane z poprzedniego postu. Linia:

    cy.url()
    .should('contain', 'http://localhost:4100/')

Weryfikuje czy uzytkownik zostal przekierowany na poprawną podstronę. Jako ze Cypress wykrywa przekierowania, nie musze implementowac osobnej logiki do czekania na załadowanie strony, mechanizmy pod spodem same o to zadbały - jak miło.

Linijki:

    cy.get(':nth-child(4) > .nav-link')
    .should('have.attr', 'href', '/@test')
    cy.get(':nth-child(3) > .nav-link')
    .should('have.attr', 'href', '/settings')
    cy.get('.container > .nav > :nth-child(2) > .nav-link')
    .should('have.attr', 'href', '/editor')

Mają za zadanie sprawdzić czy uzytkownik jest zalogowany. Sprawdzają czy wyswietalaja sie elementy w navbarze ktore sa widoczne tylko po zalogowaniu sie uzytkownika. Na razie nie wymyslilem lepszego sposobu - aplikacja nie ustawia zadnego ciastka w przegladarce wiec nie mialem sie o co innego zaczepic.

Egzekucja testu wyglada tak.:

![2-successfull-login](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F2-successfull-login-recording.mov?alt=media&token=e53c8569-7d6f-443a-84e8-287f35005392)

Mam wrazenie ze czas wykonania sie testu byl narpawde krotki, zwlaszcza w porownaniu do Selenium. Wow, nie moge doczekac sie bardziej skomplikowanych przypadkow aby zobaczyc jak to sie rozwinie. Jednak narazie nie zostal zrealizowany jeden Precondition, sorry purysci slowni, chodzi mi dokladnie o ten punkt z przypadku testowego:

    User exists

Na ten moment test dziala tylko dlatego poniewaz uzytkownik ktory zostal wykorzystywany do logowania zostal przeze mnie utowrozny recznie. Jak sie domyslasz, nie jest to dobra praktyka. Dobrą praktyką jest tworzenie testow ktore beda zawsze dzialac w izolacji. Dlatego musimy zadbac o to aby test samemu zarzadzal odpowiednim stanem aplikacji przed jego wykonaniem. Jest na to wiele sposobow, tych dobrych i tych zlych. Mozna przeklikac sie przez formualrz Rejestacji przy uzyciu Cypressa - nigdy tego nie rób, wspomnialem o tym tylko dlatego bo wiem ze przyszlo Ci to do glowy. Mozna utowrzyc uzytkownika w bazie danych przy wykorzystaniu jakiegos connectora ktory umozliwi nam polaczenie sie do bazy danych z poziomu kodu, mysle ze to dobry sposob, ale nie wykorzystam go dzisiaj. Mozna tez, co zamierzam tez zastosowac, uzyc API aby ustawic co co chcemy zeby zostalo ustawione. Dlaczego akurat ten sposob? Poniewz Cypress ma bardzo fajne wsparcie w tym kierunku, pozatym moj backend wystawia juz API wiec przy okazji zbytnio sie nie napracuje. Ponadto, API posiada tez specyfikacje wiec z latwoscia dowiem sie jakiego endpointu moge uzyc aby utworzyc nowego uzytkownika. Specyfikacje utworzoną przy uzyicu narzedzia Swagger mozna znalezc pod adresem:

    http://localhost:5000/swagger/index.html

Ale jak to localhost?! Jezeli zadajesz to pytanie to zajrzyj do tego postu: [Przygotowanie środowiska]({% post_url 2019-09-30-environment-setup %}). A wiec zagladam pod ten adres, znajduje sekcje users i bingo, endpoint POST na pewno sluzy do utworzenia uzytkownika. Skad to wiem? To API REST-owe wiec jezeli trzyma sie konwencji i dobrych praktyk to wlasnie ten endpoint typu POST o nazwie users bedzie do tego sluzyl. Model ktory musimy przekazac z zapytaniem tez na to wskazuje wiec jedziemy.

![3-swagger](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F3-swagger.png?alt=media&token=f283bce0-330f-4d08-b87c-980a4a8992ad)

Aby wyslac takie zapytanie musimy uzyc funkcji:

    request()

W zasadzie to jednej z tych wariacji:

    cy.request(url)
    cy.request(url, body)
    cy.request(method, url)
    cy.request(method, url, body)
    cy.request(options)

Wiem ze musze przekazac URL, typ endpointu i body. Uzycie bedzie wygladac nastepujaco:

    cy.request('POST', 'http://localhost:5000/users', { user: { username: 'test', email: 'test@test.com', password: 'test' }})

'POST', to method <br />
'http://localhost:5000/users', to url <br />
{ user: { username: 'test', email: 'test@test.com', password: 'test' }}, to body.<br />

Jednak po uruchomieniu testu widzimy następujący błąd:

![4-failing-request](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F4-failing-request.png?alt=media&token=a28b56cf-5a97-4914-a60b-a410def4a50e)

    Status: 400 - Bad Request
    Headers: {
    "date": "Wed, 16 Oct 2019 06:35:41 GMT",
    "content-type": "application/json",
    "server": "Kestrel",
    "transfer-encoding": "chunked"
    }
        Body: {
        "errors": {
            "Username": "in use"
        }
    }

Oznacza to ze API odpowiedzialo kodem 400 - Bad request, a powodem było to ze uzytkownik ktorego dane przekazalismy w body istnieje juz w systemie. Test nie zostal zaliczony juz na samym poczatku poniewaz mechanizm auto fail Cypress zadzialal, w przypadku requestow i odpowiedzi innych niz 2xx lub 3xx Cypres auto failuje takie testy. Mozemy temu przeciwdzialac przekazujac parametr:

    'failOnStatusCode: false'

Jednak mysle ze nie chce tego robic poniewaz uzytkownik ktorego chce utworzyc moze juz istniec w systemie, np. z innym haslem. Więc aby byc pewnym stanu aplikacji powinienen usunac uzytkownika, a nastepenie utowrzyc go w takim stanie jakiego wymaga test. Więc następnym krokiem będzie znów odwiedzenie dokuemtacji API i znalezenie endpointu który odpowiada za usunięcie uzytkowika. Szukamy najprawdopobniej endpointu o nazwie user lub useers typu DELETE.

![5-swagger-delete](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F5-swagger-delete.png?alt=media&token=9b156dcc-9236-466b-a6e8-21622ec3d2d8)

Niestety nie ma takiego endpointu. Co mozna zrobic w takim przypadku? Jezeli pracujemy nad komercyjym projektem prawdopodobnie idziemy do naszych developerów i planujemy dodanie endpointu na kolejny sprint. Słabo. Ja wyznaje zasadę ze specjalista od automatyzacji, jakkolwiek by go nie nazwac, powinien miec tez wystarczajaco wiedzy aby móc dostarczyc sobie wystarczajaco funkcji od strony aplikacji ktorą testuje aby moc ją najzwyczajniej w swiecie przetestowac. A więc? Otwieram projekt backendu i dopisuje sobie ten endpoint. Jedna uwaga, w prawdziwym projekcie prawdopodobnie powinno to byc osobne testowe API nie wystawione do klienta, zapewnie nie chcemy mu udostepnic, od tak, funkcji usuniecia kazdego uzytkowika w systemie? Nie bede opiswal tego procesu. Jezeli jendak jestes ciekawy, changeset znajdziesz tu:

    https://github.com/12masta/aspnetcore-realworld-example-app/pull/1/files

A gotowy backend w stanie dokladnym jak w tym poscie ze zmianami znajdziesz tutaj:

    https://github.com/12masta/aspnetcore-realworld-example-app/tree/cypress-2

Przypominm ze po tych zmianach aby zmiany zaszly tez w dockerze przed uruchomieniem komendy:

    make run

Nalezy uruchomic komende:

    make build

Ktora spowoduje utworzenie obrazu na nowo. Po wykonaniu tych czynnosci mam dostep endpointu DELETE users:

![5-swagger-delete-exists](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F5-swagger-delete-exists.png?alt=media&token=596c0107-4e61-41ab-9c77-9af9c6d89a94)

Więc nareszczie mozemy napisac kompletny pierwszy test. Kod wyglada tak:

    describe('Login Tests', function () {
        it('Successfull login', function () {
            cy.request('DELETE', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })
            cy.request('POST', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })

            cy.visit('http://localhost:4100/login')

            cy.get(':nth-child(1) > .form-control')
            .type('test@test.com')
            cy.get(':nth-child(2) > .form-control')
            .type('test')
            cy.get('.btn')
            .click()

            cy.url()
            .should('contain', 'http://localhost:4100/')
            cy.get(':nth-child(4) > .nav-link')
            .should('have.attr', 'href', '/@test')
            cy.get(':nth-child(3) > .nav-link')
            .should('have.attr', 'href', '/settings')
            cy.get('.container > .nav > :nth-child(2) > .nav-link')
            .should('have.attr', 'href', '/editor')
        })
    })

Egzekucja:

![6-successfull-login-complete](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F6-successfull-login-complete.mov?alt=media&token=5509cac0-c3ec-491d-bae2-1b48d78a0d9b)

## Implementacja kolejnych testów

Myślę ze mamy juz wszystkie skladniki potrzebne do implemetacji reszty przypadkow i powinno pojsc to bardzo sprawnie. Kolejny test to _Incorrect password_. W kroku podawania hasla nalezy podac bledne haslo i stworzyc asercje ktora zweryfikuej czy zostal wyswietlony poprawny komunikat uzytkownikowi. Do dziela:

  it('Incorrect password', function () {
    cy.request('DELETE', 'http://localhost:5000/users', {
      user: {
        username: 'test',
        email: 'test@test.com',
        password: 'test'
      }
    })
    cy.request('POST', 'http://localhost:5000/users', {
      user: {
        username: 'test',
        email: 'test@test.com',
        password: 'test'
      }
    })

    cy.visit('http://localhost:4100/login')

    cy.get(':nth-child(1) > .form-control')
      .type('test@test.com')
    cy.get(':nth-child(2) > .form-control')
      .type('test-icorrect')
    cy.get('.btn')
      .click()

    cy.url()
      .should('contain', 'http://localhost:4100/login')
    cy.get('.error-messages > li')
      .should('have.text', 'Error Invalid email / password.')
  })

![7-incorrect-password](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F7-incorrect-password.mov?alt=media&token=0a1acb58-a335-4dd9-90f8-13801fe2d32d)

Implementacja testu _Not existing user_ rowniez bedzie prosta. Nalezy usunac krok tworzenia uzytkowika, musimy zadbac o to zeby miec pewnosc ze nie istnieje on w bazie i ze zostanie zastosowana odpowiednie asercja ktora sprawdzi czy sotal wyswietlony poprawny komunikat bledu.:

    it('Not existing user', function () {
        cy.request('DELETE', 'http://localhost:5000/users', {
        user: {
            username: 'test',
            email: 'test@test.com',
            password: 'test'
        }
        })

        cy.visit('http://localhost:4100/login')

        cy.get(':nth-child(1) > .form-control')
        .type('test@test.com')
        cy.get(':nth-child(2) > .form-control')
        .type('test-icorrect')
        cy.get('.btn')
        .click()

        cy.url()
        .should('contain', 'http://localhost:4100/login')
        cy.get('.error-messages > li')
        .should('have.text', 'Error Invalid email / password.')
    })

![8-not-existing-user](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F8-not-existing-user.mov?alt=media&token=0e8fcc92-7438-44bc-8d2b-b4236e398a20)

Pozostał jedynie przypadek _Empty fields_ tutaj zostawiamy pola puste i naciskamy przycisk Logowania, powinien pojawić się uytkownikowi odpwoiedni komunikat błędu:

    it('Empty fields', function () {
        cy.visit('http://localhost:4100/login')

        cy.get('.btn')
        .click()

        cy.url()
        .should('contain', 'http://localhost:4100/login')
        cy.get('.error-messages > :nth-child(1)')
        .should('have.text', '\'Email\' must not be empty.')
        cy.get('.error-messages > :nth-child(2)')
        .should('have.text', '\'Password\' must not be empty.')
    })

Jak widać oczekiwany tekst to: 'Email' must not be empty. Jako ze znak ' jest uzyty jako znak zarezerwownay do przekazywania argumentu do funkcji typu string musialem uzyc znaku ucieczki \ ktory sluzy do objescia tego problemu. W tym przypadku dla Cypressa \'Email\' must not be empty. oznacza 'Email' must not be empty. Zobaczmy egzekucje testu:

![9-empty-fields](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F9-empty-fields.mov?alt=media&token=024a08b0-de75-4e11-b057-b38bc4d19c87)

Jak widać nie został zaliczony poniewaz komunikat bledu nie jest poprawny: _User.Email 'Email' must not be empty._ oraz _User.Password 'Password' must not be empty._ Właśnie znalezlismy pierwszego buga w aplikacji. :)

## Podsumowanie

Całość zmian znajdziesz na moim repo na branchu, tutaj:

    https://github.com/12masta/react-redux-realworld-example-app/tree/2-cypress
    
Changeset:

    https://github.com/12masta/react-redux-realworld-example-app/pull/2/files

Po wykonaniu tych operacji specyfikacja testowa wygląda tak:

    describe('Login Tests', function () {
        it('Successfull login', function () {
            cy.request('DELETE', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })
            cy.request('POST', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })

            cy.visit('http://localhost:4100/login')

            cy.get(':nth-child(1) > .form-control')
            .type('test@test.com')
            cy.get(':nth-child(2) > .form-control')
            .type('test')
            cy.get('.btn')
            .click()

            cy.url()
            .should('contain', 'http://localhost:4100/')
            cy.get(':nth-child(4) > .nav-link')
            .should('have.attr', 'href', '/@test')
            cy.get(':nth-child(3) > .nav-link')
            .should('have.attr', 'href', '/settings')
            cy.get('.container > .nav > :nth-child(2) > .nav-link')
            .should('have.attr', 'href', '/editor')
        })

        it('Incorrect password', function () {
            cy.request('DELETE', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })
            cy.request('POST', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })

            cy.visit('http://localhost:4100/login')

            cy.get(':nth-child(1) > .form-control')
            .type('test@test.com')
            cy.get(':nth-child(2) > .form-control')
            .type('test-icorrect')
            cy.get('.btn')
            .click()

            cy.url()
            .should('contain', 'http://localhost:4100/login')
            cy.get('.error-messages > li')
            .should('have.text', 'Error Invalid email / password.')
        })

        it('Not existing user', function () {
            cy.request('DELETE', 'http://localhost:5000/users', {
            user: {
                username: 'test',
                email: 'test@test.com',
                password: 'test'
            }
            })

            cy.visit('http://localhost:4100/login')

            cy.get(':nth-child(1) > .form-control')
            .type('test@test.com')
            cy.get(':nth-child(2) > .form-control')
            .type('test-icorrect')
            cy.get('.btn')
            .click()

            cy.url()
            .should('contain', 'http://localhost:4100/login')
            cy.get('.error-messages > li')
            .should('have.text', 'Error Invalid email / password.')
        })

        it('Empty fields', function () {
            cy.visit('http://localhost:4100/login')

            cy.get('.btn')
            .click()

            cy.url()
            .should('contain', 'http://localhost:4100/login')
            cy.get('.error-messages > :nth-child(1)')
            .should('have.text', '\'Email\' must not be empty.')
            cy.get('.error-messages > :nth-child(2)')
            .should('have.text', '\'Password\' must not be empty.')
        })
    })


    
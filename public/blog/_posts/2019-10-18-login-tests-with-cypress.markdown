---
layout: post
title:  "Testy logowania z Cypress"
date:   2019-10-17 08:03:22 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress]
---

## Wstęp

Dzisiaj na stół biorę pozornie proste testowanie logowania się użytkownika do aplikacji. Myślę jednak że mimo to, sporo się nauczysz po przeczytaniu tego posta.

Poprzedni post znajdziesz tutaj: [Zapoznanie się z Cypress]({% post_url 2019-10-01-first-tests-with-cypress %})

## Krok pierwszy

Lecimy z kodem!

![1-coding](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F1-coding_gfy.mp4?alt=media&token=7de01396-ac52-4060-8b1a-e91b26007718)

Nie, najpierw przygotujemy przypadki, które zostaną zautomatyzowane.

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

Kiedy wiadomo juz co chcemy zrobić, można zabrać się za tą ciekawsza część. ;)

Tworzę nowy plik o nazwie:

    LoginTests.spec.js 

w katalogu:

    ../cypress/integration/LoginTests.spec.js

Bierzemy się za implementację pierwszego testu - Successfull login. Na początek zaczynam pracę z użytkownikiem którego utworzyłem ręcznie za pomocą formularza rejestracji. Kod wygląda następująco:

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

Totalnie mi się on nie podoba, jest tu wiele do poprawy, ale na refaktoryzacje przyjdzie jeszcze czas. Test odgrywa swoją rolę, wypełnia formularz logowania, zatwierdza go i sprawdza warunki opisane w przypadku testowym. Metody typu .type(), .get(), .click(), są juz znane z poprzedniego postu. Linia:

    cy.url()
    .should('contain', 'http://localhost:4100/')

Weryfikuje czy użytkownik został przekierowany na poprawną podstronę. Jako ze Cypress wykrywa przekierowania, nie muszę implementować osobnej logiki do czekania na załadowanie strony, mechanizmy pod spodem same o to zadbały - jak miło.

Linijki:

    cy.get(':nth-child(4) > .nav-link')
    .should('have.attr', 'href', '/@test')
    cy.get(':nth-child(3) > .nav-link')
    .should('have.attr', 'href', '/settings')
    cy.get('.container > .nav > :nth-child(2) > .nav-link')
    .should('have.attr', 'href', '/editor')

Mają za zadanie sprawdzić, czy użytkownik jest zalogowany. Sprawdzają, czy wyświetlają sie elementy w navbarze które są widoczne tylko po zalogowaniu się użytkownika. Na razie nie wymyśliłem lepszego sposobu - aplikacja nie ustawia żadnego ciastka w przeglądarce wiec nie miałem się o co innego zaczepić.

Egzekucja testu wygląda tak.:

![2-successfull-login](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F2-successfull-login-recording_gfy.mp4?alt=media&token=2500776b-97ee-48af-ba98-2990a93f64a2)

Mam wrażenie że czas wykonania się testu był naprawdę krotki, zwłaszcza w porównaniu do Selenium. Wow, nie mogę doczekać się bardziej skomplikowanych przypadków, aby zobaczyć jak to się rozwinie. Jednak na razie nie został zrealizowany jeden Precondition, sorry puryści słowni, chodzi mi dokładnie o ten punkt z przypadku testowego:

    User exists

Na ten moment test działa tylko dlatego ponieważ użytkownik który został wykorzystywany do logowania został przeze mnie utworzony ręcznie. Jak się domyślasz, nie jest to dobra praktyka. Dobrą praktyką jest tworzenie testów które będą zawsze działać w izolacji. Dlatego musimy zadbać o to, aby test samemu zarządzał odpowiednim stanem aplikacji przed jego wykonaniem. Jest na to wiele sposobów, tych dobrych i tych złych. Można przeklikać się przez formularz Rejestacji przy użyciu Cypressa - nigdy tego nie rób, wspomniałem o tym gdyż wiem ze przyszło Ci to do głowy. Można utworzyć użytkownika w bazie danych przy wykorzystaniu jakiegoś connectora który umożliwi nam połączenie się do bazy danych z poziomu kodu, myślę że to dobry sposób, ale nie wykorzystam go dzisiaj. Można tez, co zamierzam też zastosować, użyć API aby ustawic, co co chcemy żeby zostało ustawione. Dlaczego akurat ten sposób? Ponieważ Cypress ma bardzo fajne wsparcie w tym kierunku, poza tym mój backend wystawia juz API wiec przy okazji zbytnio sie nie napracuje. Ponadto, API posiada tez specyfikacje wiec z latwoscia dowiem sie jakiego endpointu moge uzyc aby utworzyc nowego uzytkownika. Specyfikacje utworzoną przy użyciu narzędzia Swagger można znaleźć pod adresem:

    http://localhost:5000/swagger/index.html

Jak to localhost?! Jeżeli zadajesz to pytanie to zajrzyj do tego postu: [Przygotowanie środowiska]({% post_url 2019-09-30-environment-setup %}). Więc zaglądam pod ten adres, znajduje sekcje users i bingo, endpoint POST na pewno służy do utworzenia użytkownika. Skąd to wiem? To API REST-owe wiec jeżeli trzyma się konwencji i dobrych praktyk to właśnie ten endpoint typu POST o nazwie users będzie do tego służył. Model który musimy przekazac z zapytaniem tez na to wskazuje wiec jedziemy.

![3-swagger](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F3-swagger.png?alt=media&token=f283bce0-330f-4d08-b87c-980a4a8992ad)

Aby wysłać takie zapytanie musimy użyć funkcji:

    request()

W zasadzie to jednej z tych wariacji:

    cy.request(url)
    cy.request(url, body)
    cy.request(method, url)
    cy.request(method, url, body)
    cy.request(options)

Wiem ze muszę przekazać URL, typ endpointu i body. Użycie będzie wyglądać następująco:

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

Oznacza to że API odpowiedziało kodem 400 - Bad request, a powodem było to ze użytkownik którego dane przekazaliśmy w body istnieje już w systemie. Test nie został zaliczony juz na samym początku ponieważ mechanizm auto fail Cypress zadziałał, w przypadku requestow i odpowiedzi innych niz 2xx lub 3xx Cypres auto failuje takie testy. Możemy temu przeciwdziałać przekazując parametr:

    'failOnStatusCode: false'

Jednak myślę, że nie chce tego robić, ponieważ użytkownik, którego chce utworzyć może już istnieć w systemie, np. z innym hasłem. Więc aby być pewnym stanu aplikacji powinienem usunąć użytkownika, a następnie utworzyć go w takim stanie, jakiego wymaga test. Więc następnym krokiem będzie znów odwiedzenie dokumentacji API i znalezienie endpointu, który odpowiada za usunięcie użytkownika. Szukamy najprawdopobniej endpointu o nazwie user lub users typu DELETE.

![5-swagger-delete](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F5-swagger-delete.png?alt=media&token=9b156dcc-9236-466b-a6e8-21622ec3d2d8)

Niestety nie ma takiego endpointu. Co można zrobić w takim przypadku? Jeżeli pracujemy nad komercyjnym projektem, prawdopodobnie idziemy do naszych developerów i planujemy dodanie endpointu na kolejny sprint. Słabo. Ja wyznaje zasadę, że specjalista od automatyzacji, jakkolwiek by go nie nazwać, powinien mieć też wystarczająco wiedzy, aby móc dostarczyć sobie wystarczająco funkcji od strony aplikacji, którą testuje, aby moc ją najzwyczajniej w świecie przetestować. A więc? Otwieram projekt backendu i dopisuje sobie ten endpoint. Jedna uwaga, w prawdziwym projekcie prawdopodobnie powinno to być osobne testowe API niewystawione do klienta, zapewnie nie chcemy mu udostępnić, ot, tak, funkcji usunięcia każdego użytkownika w systemie? Nie będę opisywał tego procesu. Jeżeli jednak jesteś ciekawy, changeset znajdziesz tu:

    https://github.com/12masta/aspnetcore-realworld-example-app/pull/1/files

A gotowy backend w stanie dokładnym jak w tym poście ze zmianami znajdziesz tutaj:

    https://github.com/12masta/aspnetcore-realworld-example-app/tree/cypress-2

Przypominam że po tych zmianach, aby zmiany zaszły tez w dockerze przed uruchomieniem komendy:

    make run

Należy uruchomić komendę:

    make build

Która spowoduje utworzenie obrazu na nowo. Po wykonaniu tych czynności mam dostęp endpointu DELETE users:

![5-swagger-delete-exists](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F5-swagger-delete-exists.png?alt=media&token=596c0107-4e61-41ab-9c77-9af9c6d89a94)

Więc nareszcie możemy napisać kompletny pierwszy test. Kod wygląda tak:

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

![6-successfull-login-complete](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F6-successfull-login-complete_gfy.mp4?alt=media&token=7a7f941f-6748-459c-bdd7-7e5bfdd247bd)

## Implementacja kolejnych testów

Myślę, że mamy już wszystkie składniki potrzebne do implementacji reszty przypadków i powinno pójść to bardzo sprawnie. Kolejny test to _Incorrect password_. W kroku podawania hasła należy podać błędne hasło i stworzyć asercje, która zweryfikuje czy został wyświetlony poprawny komunikat użytkownikowi. Do dzieła:

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

![7-incorrect-password](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F7-incorrect-password_gfy.mp4?alt=media&token=ebe263e6-8971-4d25-845c-153bf47c3a62)

Implementacja testu _Not existing user_ również będzie prosta. Należy usunąć krok tworzenia użytkownika, musimy zadbac o to zeby miec pewnosc ze nie istnieje on w bazie i że zostanie zastosowana odpowiednie asercja ktora sprawdzi czy został wyświetlony poprawny komunikat błędu.:

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

![8-not-existing-user](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F8-not-existing-user_gfy.mp4?alt=media&token=d07b476b-9aef-4e17-a2a9-770d8d67204a)

Pozostał jedynie przypadek _Empty fields_ tutaj zostawiamy pola puste i naciskamy przycisk Logowania, powinien pojawić się użytkownikowi odpowiedni komunikat błędu:

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

Jak widać oczekiwany tekst to: 'Email' must not be empty. Jako ze znak ' jest użyty jako znak zarezerwowany do przekazywania argumentu do funkcji typu string musiałem użyć znaku ucieczki \ który służy do obejścia tego problemu. W tym przypadku dla Cypressa \'Email\' must not be empty. oznacza 'Email' must not be empty. Zobaczmy egzekucje testu:

![9-empty-fields](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F9-empty-fields_gfy.mp4?alt=media&token=00c333c1-c8ea-41fd-bf0f-3cea817a91de)

Jak widać nie został zaliczony poniewaz komunikat bledu nie jest poprawny: _User.Email 'Email' must not be empty._ oraz _User.Password 'Password' must not be empty._ Właśnie znaleźliśmy pierwszego buga w aplikacji. :)

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

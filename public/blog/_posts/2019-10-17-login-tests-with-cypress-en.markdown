---
layout: post
title:  "Login tests with Cypress"
date:   2019-10-17 08:03:22 +0200
categories: [testautomation, cypress]
tags: [testautomation, cypress, en]
---

## Introduction

Today in menu we have seemingly simple user login test case. However I think you
will learn quite a log after this post.

Previous post can be found here : [Introduction into Cypress]({% post_url
2019-10-01-first-tests-with-cypress %})

{% include_relative subForm-en.markdown %}

## First step

Let's code! But wait, firstly we prepare test cases which will be automatized.

Personally I prefer write cases in following manner:

**Preconditions:**

*

**Steps:**

1.

**Expected results:**

*

I will not explain them. Cases are not complicated, well it just a login test.

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

## Implementation of first test

When we know what we gonna do, we can start more interesting part. ;)

I am creating a new file with name:

    LoginTests.spec.js

in directory:

    ../cypress/integration/LoginTests.spec.js

We're are taking on table implementation of first test - Successfull login. At
beginning I start work with user I've created manually via register form. Code
looks as follow:

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

I am not satisfied at all with the code. It can be improved, however we will
have time for refactorization later. Test does do its job. Fills and confirms
login form, checks conditions described in test case. Methods .type(), .get(),
.click(), should be familiar with you from previous post. Line:

    cy.url()
    .should('contain', 'http://localhost:4100/')

Verifies whether user was redirected to correct page. Cypress detects redirections
so I don't have to implement separate waiting logic for page reload. Mechanism
under the hood have taken care of it - it's so convenient.

Lines:

    cy.get(':nth-child(4) > .nav-link')
    .should('have.attr', 'href', '/@test')
    cy.get(':nth-child(3) > .nav-link')
    .should('have.attr', 'href', '/settings')
    cy.get('.container > .nav > :nth-child(2) > .nav-link')
    .should('have.attr', 'href', '/editor')

Have to check whether user is logged in. They check if elements are displayed in
navivar which are visible after login the user. For now I've haven't found better
solution since application doesn't set any cookie in browser which I could relay
on.

Test execution look:

![2-successfull-login](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F2-successfull-login.png?alt=media&token=36df9d5d-284e-48dc-9d50-e514c7cce3e4)

I have impression that test time execution was really short, especially compared
to Selenium. Wow, I can not wait for more complicated cases to see how it will
develop. But for now a one Precondition was not accomplished:

    User exists

At the moment test works only because user which was used for login was created
manually by me. As you can predict, it's a bad practice. We have to aim to
create test which will work in isolation. We need to ensure that test manages
properly of application state before it's execution. There is plenty ways, good
and bad. We can pass through registration form using Cypress - never don't do
it. I mention it because you've probably though about it. We can create an user
in database by using a connector which allows connection to database from code
level. In my opinion it's good solution, however I will not use it today.
Instead I will use an API to set what we need. Why this particular solution?
Because Cypress has a nice support for API and my back-end expose already and
API, so it's simpler for me. Additionally API has build-in specification which
allows easily search an endpoint for user creation. Specification created by
Swagger tool can be found under URL:

    http://localhost:5000/swagger/index.html

What? A localhost?! You will find answer in this post: [Environment
preparation]({% post_url 2019-09-30-environment-setup-en %}).  So I check
provided URL link, I search for user section and bingo, endpoint POST allows
create an user. How do I know it? It's REST API so as long it follows
convention and good practices then this particular type of endpoint - POST -
with name users will be designed for it. Model which we have to sent with
request also indicates it's create user. Let's go then.

![3-swagger](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F3-swagger.png?alt=media)

To send such request we need to use function:

    request()

Basically it's one of those options:

    cy.request(url)
    cy.request(url, body)
    cy.request(method, url)
    cy.request(method, url, body)
    cy.request(options)

I need to pass an URL, type of endpoint and body. Usage will look as follow:

    cy.request('POST', 'http://localhost:5000/users', { user: { username: 'test', email: 'test@test.com', password: 'test' }})

'POST', it's a method <br />
'http://localhost:5000/users', it's an url <br />
{ user: { username: 'test', email: 'test@test.com', password: 'test' }}, is a body.<br />

However, after test execution we see an error:

![4-failing-request](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F4-failing-request.png?alt=media)

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

It indicates that API responded with code 400 - Bad request, and reason was
that particular user passed in body already exists in application. Test failed
at very beginning because auto fail mechanism of Cypress worked. In case of
responses 2xx or 3xx Cypress automatically fails tests. We can prevent it by
passing parameter:

    'failOnStatusCode: false'

Jednak myślę, że nie chce tego robić, ponieważ użytkownik, którego chce
utworzyć może już istnieć w systemie, np. z innym hasłem. Więc aby być pewnym
stanu aplikacji powinienem usunąć użytkownika, a następnie utworzyć go w takim
stanie, jakiego wymaga test. Więc następnym krokiem będzie znów odwiedzenie
dokumentacji API i znalezienie endpointu, który odpowiada za usunięcie
użytkownika. Szukamy najprawdopobniej endpointu o nazwie user lub users typu
DELETE.

![5-swagger-delete](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F5-swagger-delete.png?alt=media)

Niestety nie ma takiego endpointu. Co można zrobić w takim przypadku? Jeżeli
pracujemy nad komercyjnym projektem, prawdopodobnie idziemy do naszych
developerów i planujemy dodanie endpointu na kolejny sprint. Słabo. Ja wyznaje
zasadę, że specjalista od automatyzacji, jakkolwiek by go nie nazwać, powinien
mieć też wystarczająco wiedzy, aby móc dostarczyć sobie wystarczająco funkcji
od strony aplikacji, którą testuje, aby moc ją najzwyczajniej w świecie
przetestować. A więc? Otwieram projekt backendu i dopisuje sobie ten endpoint.
Jedna uwaga, w prawdziwym projekcie prawdopodobnie powinno to być osobne
testowe API niewystawione do klienta, zapewnie nie chcemy mu udostępnić, ot,
tak, funkcji usunięcia każdego użytkownika w systemie? Nie będę opisywał tego
procesu. Jeżeli jednak jesteś ciekawy, changeset znajdziesz tu:

    https://github.com/12masta/aspnetcore-realworld-example-app/pull/1/files

A gotowy backend w stanie dokładnym jak w tym poście ze zmianami znajdziesz
tutaj:

    https://github.com/12masta/aspnetcore-realworld-example-app/tree/cypress-2

Przypominam że po tych zmianach, aby zmiany zaszły tez w dockerze przed
uruchomieniem komendy:

    make run

Należy uruchomić komendę:

    make build

Która spowoduje utworzenie obrazu na nowo. Po wykonaniu tych czynności mam
dostęp endpointu DELETE users:

![5-swagger-delete-exists](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F5-swagger-delete-exists.png?alt=media)

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

![6-successfull-login-complete](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F6-successfull-login-complete.png?alt=media&token=ea33f4c3-13d2-4f41-9057-3fa0b40112d1)

## Implementacja kolejnych testów

Myślę, że mamy już wszystkie składniki potrzebne do implementacji reszty
przypadków i powinno pójść to bardzo sprawnie. Kolejny test to _Incorrect
password_. W kroku podawania hasła należy podać błędne hasło i stworzyć
asercje, która zweryfikuje czy został wyświetlony poprawny komunikat
użytkownikowi. Do dzieła:

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

![7-incorrect-password](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F7-incorrect-password.png?alt=media&token=94f0aecd-9293-40cd-94a3-fc25686feef0)

Implementacja testu _Not existing user_ również będzie prosta. Należy usunąć
krok tworzenia użytkownika, musimy zadbac o to zeby miec pewnosc ze nie
istnieje on w bazie i że zostanie zastosowana odpowiednie asercja ktora
sprawdzi czy został wyświetlony poprawny komunikat błędu.:

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

![8-not-existing-user](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F8-not-existing-user.png?alt=media&token=b66f8eca-c912-406d-b8de-222008e62fa3)

Pozostał jedynie przypadek _Empty fields_ tutaj zostawiamy pola puste i
naciskamy przycisk Logowania, powinien pojawić się użytkownikowi odpowiedni
komunikat błędu:

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

Jak widać oczekiwany tekst to: 'Email' must not be empty. Jako ze znak ' jest
użyty jako znak zarezerwowany do przekazywania argumentu do funkcji typu string
musiałem użyć znaku ucieczki \ który służy do obejścia tego problemu. W tym
przypadku dla Cypressa \'Email\' must not be empty. oznacza 'Email' must not be
empty. Zobaczmy egzekucje testu:

![9-empty-fields](https://firebasestorage.googleapis.com/v0/b/marcinstanek-a2c3b.appspot.com/o/2019-10-18-login-tests-with-cypress%2F9-empty-fields.png?alt=media&token=42e52bb2-9f81-484c-9147-d76996fd357d)

Jak widać nie został zaliczony poniewaz komunikat bledu nie jest poprawny:
_User.Email 'Email' must not be empty._ oraz _User.Password 'Password' must not
be empty._ Właśnie znaleźliśmy pierwszego buga w aplikacji. :)

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

{% include_relative leadmagnet.markdown %}

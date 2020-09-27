---
layout: post
title:  "Test automation boilerplate"
date:   2020-11-01 18:03:22 +0200
categories: selenium
tags: en
---

## Introduction

Recently I made an effort to obtain a new client. One of task to prove my skills
was to code simple prototype of testing framework. Let me use it as advantage
to present to you how I solve such exercise.

Let's begin with boilerplate. It's a foundation of testing framework, a
skeleton code which we can, and we should use in future development.

## Tools

We will use:
* Java, programming language
* Groovy, second programming language, nonetheless nothing to afraid of ;-)
* Spock Framework, library in which we will design the tests
* Maven, building and managing dependencies
* IntelliJ, IDE

## Creating a project

Open IDE and choose Create New Project. In new window pick Meaven. Make sure you've
picked Project SDK. Select Groovy and click Next. Now set a name for your project.
In my case a name for GroupId:

    com.teachqa

ArtifactId:

    mavenspockseleniumwebdriverboilerplate

I leave Version field untouched and click Next.

I use auto import. Click Next and then Finish.

Project is created.

Remove directory src, because we need more complex structure to organize better
modules inside the project.

Add new module into project named testframework. In future we put here files containing
test logic.

Add next module, you can named it tests. In this place we create tests for our application.

Project tree after all those chances should present as follow:


## Dependencies

We will use following external libraries to ease our life.

Go to pom.xml in module tests and add section in node <modules>:

# selenium-java

Library to test UI

        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>3.14.0</version>
        </dependency>

# Spock framework

Framework to create tests and specifications, designed for applications written in Java and Groovy.

        <dependency>
            <groupId>org.spockframework</groupId>
            <artifactId>spock-core</artifactId>
            <version>1.1-groovy-2.4</version>
        </dependency>

# spock-retry

Useful for e2e tests, in case of failure it repeats tests N times - determined by us.
As we know stability of tests written in Selenium WebDriver may varies, it's worth
to consider adding it to application.

        <dependency>
            <groupId>com.anotherchrisberry</groupId>
            <artifactId>spock-retry</artifactId>
            <version>0.6.4</version>
        </dependency>

# webdrivermanager

Library which helps manage driver binaries for Selenium WebDriver. Fairly new.
I use it since beginning of 2018 in commercial project. In my opinion it's OK.
I recommend.

        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>3.0.0</version>
        </dependency>

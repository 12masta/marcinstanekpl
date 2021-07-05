---
layout: post
title:  "Retry policy for methods in terms of integration tests"
date:   2021-07-01 08:00:00 +0200
categories: [testautomation, .net, polly]
tags: [testautomation, .net, polly, en]
permalink: /en/dotnet-polly
ogimage:
  - TODO
ogimagetype:
  - image/png
ogdescription:
  - Implementing retry policy in test methods
---

## Retry policy

During several integrations of tests implementation across the .NET-based projects, I was struggling very often race conditions across the methods which try to pull some state from the DB to make some assertion on it. Very often this is a point of failure which makes the integration tests flaky.

 I saw some implementation of Polly library in the case where as a team we were trying to consume 3rd parties API’s to increase resilience. I decided to try the same in the tests in terms of methods that pull some data from the database. The solution looks promising it already fixes some issues in the project which I am currently working on.
 
This is how code can look like:

{% highlight csharp %}
public string Id { get; set; }
public EntitiesDatabaseLoader Entities { get; set; }

(...) // some piece of code arround

return Policy.HandleResult<Entity>(r => r == null)
       .WaitAndRetry(new[]
       {
         TimeSpan.FromSeconds(1),
         TimeSpan.FromSeconds(2),
         TimeSpan.FromSeconds(3)
       })
       .Execute(() => Entities.Load(Id));
{% endhighlight %}

_HandleResult_ method is responsible for handling behaviour defined as argument passed to it.

_WaitAndRetry_ method defines a specified duration between each retry. 

_Execute_ method is a simply piece of code which we want to retry in case of failures which we just defined.

There is a such more possibilities defined in the library documentation.

## Summary

Thanks to such approach we can create much more stable tests. When creating Wait and Retry policy we should be wise in defining of time frames to fit also negative testing cases. Otherwise, it will take too long to execute such cases precisely because of the policy we have just created.

Link to the library: [https://github.com/App-vNext/Polly](https://github.com/App-vNext/Polly) 

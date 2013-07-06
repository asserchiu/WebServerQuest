Web Server Quest
========================================================================

Web Server Quest is a Google Chrome extension that record and count up
 your activities on requesting web pages. It can summarize the count of
 web server types and technologies used by each page request.

You can also use existed or setup your own [Cube][] server that helps
 you record each request and deriving metrics. With the help of Cube,
 you can make richer analysis in *post-hoc* manner, such as quantiles
 and histograms of arbitrary event sets.

For the future work, we are going to provide a mini roll playing game
 that makes it more fun for end users.

Preface
------------------------------------------------------------------------

In recent years, researches and web analytic tools help web developers
 get to know their user. Such as the popularity of the browsers and OSs.
 However, there are few tools for us to understand how these excellent
 web sites built on and how the web get composited.

To get to know the web, we have to collect server properties from all
 popular web servers that distributed all over the world. Instead of
 setting up dozens of crawlers walking through the web, we adopt
 crowd-sourced computing model for user orientated statistics.

What can you get after using Web Server Quest?
------------------------------------------------------------------------

### Statistic collected locally: (display with pop-up window)

- Total number for each
    - Web server types (`serverType`)
    - Application stack types (`serverTech`)

![fig_rawData][]

- Diagrams for historical events of each
    - Web server types (`serverType`)
    - Application stack types (`serverTech`)

![fig_serverType][]
![fig_serverTech][]

### After uploaded to a [Cube] server:

- Overall page popularity
- Overall domain popularity
- Overall web server popularity
- Overall application stack popularity
- ... and more

![fig_cubism][]

What do we log?
------------------------------------------------------------------------

- Time-stamps
- Response status code
- For each document request, we record the URL string without `#` part,
  which meant to be an anchor. We can now get the domain name and
  "some" detail about each request.
- Web server type (`serverType`)
- Application stack type (`serverTech`)
- **Future work:** Host OS type
- **Future work:** Users' Nationality by their IP or other libraries

How to promote?
------------------------------------------------------------------------

> Play the game, unveil the web.

That is, Gamification!

We are going to provide a mini RPG game in the future.

Permissions and Data Policy
------------------------------------------------------------------------

- This extension monitor and record user's browsing activity locally
  for counting and plotting.
- Browsing event will send to `localhost` by default,
  you can change it to other trusted servers.
- **Future work:** Local storage for
    - settings
    - statistics
    - game save data

Acknowledgment and License(s)
------------------------------------------------------------------------

### Web Server Quest was inspired by:

- [Web Server Notifier][] ([MIT License][])
- [Web Technology Notifier][] ([MIT License][])

### Web Server Quest Google Chrome extension uses:

- [dygraphs][] ([MIT License][])
- [Cubism.js][] ([Apache License][])
    - [D3.js][] ([BSD License][])

### This document is generated with

- [Docker][]

For detailed parameters, please take a look in `Makefile`.

Shortcuts
------------------------------------------------------------------------

- Overall performance: [server dashboard](http://localhost:1081/)
- Dashboard with chosen facts: [demo dashboard](../html/monitor.html)

Copyright (c) 2013 Asser Chiu, released under the [MIT license][].

<!-- Figures -->

[fig_serverType]: ./images/fig_serverType.png "fig_serverType"
[fig_serverTech]: ./images/fig_serverTech.png "fig_serverTech"
[fig_rawData]: ./images/fig_rawData.png "fig_rawData"
[fig_cubism]: ./images/fig_cubism.png "fig_cubism"

<!-- Links -->

[Cube]: http://square.github.io/cube/ "Cube"
[Cubism.js]: http://square.github.io/cubism/ "Cubism.js"
[D3.js]: http://d3js.org/ "D3.js"
[Docker]: http://jbt.github.io/docker/ "Docker"
[dygraphs]: http://dygraphs.com/ "dygraphs"
[Web Server Notifier]: https://github.com/cyril/web_server_notifier "Web Server Notifier"
[Web Technology Notifier]: https://github.com/cyril/web_technology_notifier "Web Technology Notifier"

<!-- Licenses -->

[Apache License]: http://www.apache.org/licenses/LICENSE-2.0.html "Apache License"
[BSD License]: http://opensource.org/licenses/BSD-3-Clause "BSD license"
[MIT License]: http://opensource.org/licenses/MIT "MIT license"

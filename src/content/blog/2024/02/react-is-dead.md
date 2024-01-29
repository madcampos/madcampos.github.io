---
title: React is dead, long live react
summary: My view on the current react situation and how it is just part of a cycle.
image: ./assets/galaxy-crown.jpg
imageAlt: AI generated image of a crown made up of galaxies and stars. The background is made of a city skyline in the vaporwave style. Lines move to the crown
createdAt: 2024-02-01
draft: true
tags:
  - web
  - react
  - rant
  - hot-take
---
This is a hot take on the current react situation, so brace yourselves.

## Papers, please...

First I have to start with the obligatory disclaimer that I work with react on my day to day job. I don't hate it, but I don't like it either, it pays the bills as much as any other tech before or after it will pay.

That out of the way let's get into my analysis.

## It's the circle of life, and it moves us all

What I'm seeing right now seems to me just like another cycle coming to an end and starting anew.

[Flash](https://en.wikipedia.org/wiki/Adobe_Flash) went through that, the iPhone killed it. It dragged for some time but it's demise was inevitable, and already coming for some time.

At the time of the big announcement that the iPhone would not be supporting Flash at all people were already giving up on it. Sure, it was easy to use, but HTML5 was already a thing and the promise of nice and _flashy_ websites (pun intended) without plugins was pretty much real.

[jQuery](https://jquery.com/) went through it as well, but in a different way. It got forgotten and replaced.

When I started working on web development we were required to _know_ jQuery pretty much like it is required to _know_ react nowadays. The editor of choice was [Dreamweaver](https://en.wikipedia.org/wiki/Adobe_Dreamweaver) and [Windows Vista](https://en.wikipedia.org/wiki/Windows_Vista) had just been released. We used `<table>`s for layout.

It was hard, but both jQuery and Flash made our lives easier and sane, we didn't have to deal with all the inconsistencies between all the versions of Internet Explorer, Firefox, Safari, Opera and the new kid on the block, Chrome.

But then those tools got replaced, the only thing left is their legacy. Flash gave us [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), jQuery gave us [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector). Those tools made us better and here we are, react is doing the same thing.

## Context is key

React was not the first of it's kind to try and create components and make web developer's lives easier. It stood in the shoulders of giants.

Before react, we had [Angular.js](https://en.wikipedia.org/wiki/AngularJS) (no, not the modern day Angular, the old one) but it was still quite complex. The ["bananas in a box"](https://angular.io/guide/two-way-binding) analogy always makes me cringe.

Even before angular we had [backbone](https://backbonejs.org/), before that, PHP had includes and we always had a `header.php`, a `content.php`, and a `footer.php` that _compose together_, like _components_.

So react is not the inventor of components, even the JSX syntax is not new, before that was [E4X](https://en.wikipedia.org/wiki/ECMAScript_for_XML). But that idea didn't gain much traction.

On that scenario, react was created to solve Facebook's problem of their page being a pain to maintain and slow to render.

A confluence of factors made react a viable option and helped it gain momentum:
1. It resolved browser inconsistencies.
2. It gave a sane model for data binding.
3. It was lightweight.
4. ~~Facebook~~ Meta was backing it up. _hard_.

All of those things combined helped react gain some well deserved approval and support from developers.

But things have changed since then. Let's break down the points listed.

## Let's be friends

Thankfully, Internet Explorer is no more and now we can bully another browser, Safari.

Jokes aside, browsers nowadays are much more consistent between each other and cooperate more, check out [Interop 2023](https://wpt.fyi/interop-2023) for an example of all browsers coming together to make the web more consistent between all of them.

Also, web apps are a thing thanks to react that pushed for them to be a thing, but also thanks to browsers making them run _smoothly_, albeit while eating all of your RAM.

With that in mind, all browsers have decent support for modern features like [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) that make reactivity work nicely. For most people the DOM is really fast, so we technically don't need a virtual DOM anymore.

So yeah, while we should thank react for popularizing web apps it is still stuck without using the full potential of more modern things.

Which brings me to the next point...

## It's all about data

The "data flows only one way" model of thinking is useful to break of the utter chaos that was angular's "bananas in a box". That thing is insane.

But things don't need to be all or nothing. If you look at Vue's model, it has [two way data binding](https://vuejs.org/guide/essentials/forms) but it flows more naturally and don't enforce you to make your code to be a specific way just because the library doesn't support it.[^1]

## How to lose 10 lb in 10 days

So react is lightweight, I get that, but it also does not include some needed features like a router. And you need to import both `react` and `react-dom` instead of a single convenience package.

You don't need to be like angular where everything and your neighbour's kitchen sink comes included with the package. But you also don't need to be super trimmed down to the point that you need a thousand libraries just to start a project.

So yeah, like with our nutrition, balance is important!

## Vercel

And now comes the down slope of the rollercoaster...

Although not without controversies, Meta has supported the library in an okay state, but now it seems they abandoned ship and left it to be stewarded by Vercel. And that has caused a ton of controversies.

I get that a company can not be invested anymore and just leave a project, everything ends at some point.

But my feeling is that Vercel is creating a situation where even the community that lives and breathes react is turning against then. That is not good.

## 1$ for your luck

The way I see things is not with react dying a quick death that everyone will migrate to the [next shiny thing](https://en.wikipedia.org/wiki/Shiny_object_syndrome). It will probably go a slow death and possibly be forked, like MariaDB was a fork from MySQL. That is it, no hate for it. The tool will still live on.

What is interesting about all this is how people are so polarized and it is trendy to bash on react. It is not bad, it is not good either...

It just is a product of a point in time, with a context, that helped push the web forward. We have to thank react for all it's contributions but not forget that things end.

[^1]: It seems to me that react only forces people to write immutable code because it doesn't work with proxies.
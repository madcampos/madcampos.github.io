---
title: Going astro 🚀
createdAt: 2024-01-14
summary: A tale of how I went from a vite site to an astro site and the hurdles along the way.
tags:
  - BuildInTheOpen
  - BuildingInPublic
  - meta
  - coding
  - astro
  - vite
  - 11ty
image: ./assets/astro-corgi.jpeg
imageAlt: AI generated image of a corgi on a red rocket costume flying through space with planets and rainbows on the background.
---
So, I migrated my blog and website to [Astro](https://astro.build)...

![Gif of a man on a costume of a rocket. He walks around like he is flying on the rocket](./assets/rocket.gif)

Here is _why_.

## Vite is _nice_, tooling is _not_

Vite is really good to write single page apps and the kings of applications that run mostly on the client. It has some friction when it comes to static generated websites like blogs.

This site, and blog, is mostly static and can be generated based on data and a set of templates.

My first attempt was to write the tooling myself to see how that worked (you can read about it on the posts ["Hello, World!"](/blog/2023/06/hello-world/) and ["The Semantics of Blogging"](/blog/2023/06/blog-structure/)), but that proved to be more difficult than expected.

The hard part was Vite is "low level" enough that when we try to build a system on top of it to process files it is hard and has to pierce the layers of niceties into even lower levels. Like working with [parcel](https://parceljs.org/).

It could be worse, I could have to configure [webpack](https://webpack.js.org/) from scratch, and that requires a PhD in rocket science (#foreshadowing).

## First attempt

My first attempt was to use [11ty](https://www.11ty.dev/). It is an interesting tool and provided me a way to reorganize the templates for the blog and dynamic content.

Then I stumbled upon some issues with their documentation and "advanced use cases" like adding an RSS feed. Yes, I'm very particular about my XMLs, [RSS](/blog/2023/06/xml-is-not-dead/) and [SVGs](https://codepen.io/madcampos/pen/NWRdOeW) and I'd like to keep it that way.

I'm not trying to roast 11ty here, it is a really good tool, works great and is very beginner friendly. But I felt I needed more control over how things work than it provided.

## In comes Astro...

[Astro](https://astro.build) is a static site generator much like 11ty, but a little bit more "full featured" and supports some advanced use cases like adding RSS feeds. Ironically it is built _on top of_ Vite... Surprise, surprise! We came full circle!

The experience of working with Astro was very pleasant. The documentation is thorough and the tutorial covers a lot of ground.

Migrating the blog was a couple days light work, not very hard to do and I was able to split much of the parts into reusable components.

## There are always roadblocks

![AI generated image of a long road leading to a city. The road has multiple police lines and some cars parked along the way creating a blocade.](./assets/road-block.jpeg)

To reiterate: I'm _very particular_ about my XMLs. One issue that kept me banging my head was generating the post images for the RSS feeds.

The problem with that is that the RSS specification requires that you specify the image size in bytes. And as much as Astro is helpful it doesn't provide a way to get the image size at build time.

I had to go out of my way and write some pretty hacky code to get that functionality in and actually get the file size.

Here is the code if you are curious: https://github.com/madcampos/madcampos.github.io/blob/main/src/pages/blog/feed.xml.ts#L27-L38

## Conclusion

All the changes, migrations and experiments were for the better and led to a more robust and easier to maintain structure.

But, not everything is without trouble and we can be stuck in the same issue for some time. And getting your hands dirty is the best way to assess if the choices we make are the best they can be. 🤷‍♂️

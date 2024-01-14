---
title: "XML Is Surprisingly Not Dead"
createdAt: "2023-06-30"
summary: "A quick post about styling XML feeds and other uses for XML."
image: "./arcane-c-incantations.jpg"
imageAlt: 'AI generated image for the prompt: "an arcane incantation on an old manuscript with C++ code"'
tags:
  - "XML"
  - "web"
  - "CSS"
  - "BuildInTheOpen"
  - "BuildingInPublic"
  - "FrontendDevelopment"
---

While building this blog I included one of my favorite yet underrated features: [RSS feeds](https://www.rssboard.org/rss-specification) support.

While RSS feeds are old and I feel like a boomer to use it, they are a nice way to consume content _directly_ from the source. No ads, no tracking, no selling your soul to the [FAANG](https://en.wikipedia.org/wiki/Big_Tech) overlords.

![GIF from The Simpsons with a newspaper headline that reads: "Old Man Yells at Cloud"](./old-man-yells-at-cloud.gif)

## The Trigger

The other day I was reading a newsletter and stumbled upon [this post by Darek Key](https://darekkay.com/blog/rss-styling/). It is an interesting read that shows how to style XML feeds using CSS.

Actually, there is a little more to it...

## Arcane XML Incantations

![A GIF from the movie "Army of Darkness" showing the protagonist failing to remember an incantation](./klaatu-barada-nikto.gif)

The way the styling of a RSS feed is done is first through a [XSLT](https://developer.mozilla.org/en-US/docs/Web/XSLT) file. This file is a XML file that contains the instructions to transform the XML feed into HTML. _Then_ it has structure and can be styled with CSS.

## XSLT Transformations

The core idea behind XSLT transformations is to map an input XML file to some output, it can do things like:
- [For loops](https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/for-each)
- [If statements](https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/if)
- [Variables](https://developer.mozilla.org/en-US/docs/Web/XSLT/Element/variable)
- [Built-in functions](https://developer.mozilla.org/en-US/docs/Web/XPath/Functions)

Basically, what every modern developer wants from a templating language. The drawback is: it is cumbersome and weird to write.

Here is an example of the link with a logo image on the header:
```xml
<a id="logo">
	<xsl:attribute name="href">
		<xsl:value-of select="/rss/channel/link"/>
	</xsl:attribute>
	<img>
		<xsl:attribute name="src">
			<xsl:value-of select="/rss/channel/image/url"/>
		</xsl:attribute>
		<xsl:attribute name="alt">
			<xsl:value-of select="/rss/channel/image/title"/>
		</xsl:attribute>
	</img>
</a>
```

Which outputs:
```html
<a id="logo" href="https://madcampos.dev/blog/">
	<img src="https://madcampos.dev/icons/transparent/manifest-icon-512.png" alt="Marco Campos' Blog">
</a>
```

## The Verdict

It is cool that we can do something like this and it Just Works™ in browsers. But it is not something I would use to build the core of my website.

If you want to check it out go to: https://madcampos.dev/blog/rss.xml

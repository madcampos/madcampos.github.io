<!--
description: A dive into the semantic html of a blog.
tags: buildintheopen, meta, coding, vite, ts
-->

# The Semantics of Blogging

Building an html page is fun... until you find yourself lost in a sea of meaningless `div`s.

The problem with html tags and, by extension the problem with language in general, is that _naming_ and _categorizing_ things _is hard_! There is a whole field of taxonomy and people spend years and a PhD thesis studing how to name and classify things.

## Anatomy of an Article Page

Let's start with the full markup for the article page and then break it down to it's parts. I'm only showing the `body` here for brevity, but you can see the full template in the [github repo](https://github.com/madcampos/madcampos.github.io/blob/main/src/templates/post.html).

```html
<body>
	<article>
		<div id="post-header">
			<nav id="back-to-blog">
				<!-- link to blog home, removed for brevity -->
			</nav>
			<header>
				<h1>{{title}}</h1>
				<aside>Published on <time itemprop="dateCreated" datetime="{{createdAt}}">{{formatDate createdAt}}</time></aside>
			</header>
		</div>

		<main id="post-contents" itemprop="articleBody">
			{{{content}}}
		</main>
	</article>
</body>
```

## What Even is an `<article>`?

Interestingly enough, an `<article>` can mean more than a blog article, it can be also an item card on a shopping website, or a recipe, or even a forum post. The idea is that an `<article>` is a standalone piece of content. It can be read on its own, and it makes sense on its own.

To quote from the html spec:
> The article element represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content.

This gives us a basic structure for creating a post:
```html
<article>
	<!-- Navigation -->
	...
	<!-- Title -->
	...
	<!-- Content -->
	...
</article>
```

And also the card used on the post lists use a similar structure, but we will get into the other templates on a later post:
```html
<article class="post-card">
	<header>
		<a href="{{url}}"><h2>{{title}}</h2></a>
		<a href="{{url}}"><span>{{createdAt}}</span></a>
	</header>
	{{{summary}}}
	<footer>
		<a href="{{url}}">Read more...</a>
	</footer>
</article>
```

## Keeping Your `<header>` in the Right Place

The header tag serves to represent _almost everything_ that comes before the main content of the page. By _almost everything_, I mean data and metadata related to the article, in the case `<nav>` doesn't belong in the header, but the `<aside>` does.

The reason behind it is that `<nav>` in that case is the _global_ page navigation. As for `<aside>`, it is metadata related to the article. That way things are organized and fullfill their semantic purpose.

## What About Metadata?

For adding metadata and repesenting it, there are the regular html tags on the `<head>`, [Open Graph](https://ogp.me/) tags, and [Schema.org](https://schema.org/) properties.

The relevant tags inside the `<head>` looks somewhat like this:
```html
<meta charset="utf-8" />
<link rel="canonical" href="{{url}}" />
<link rel="alternate" type="application/atom+xml" href="/blog/rss.xml" title="Marco Campos' Blog" />

<title>{{title}} | Marco Campos | Blog</title>

<meta property="og:title" name="twitter:title" itemprop="name" content="{{title}}" />
<meta property="og:description" name="description" itemprop="abstract" content="{{summary}}" />
<meta property="og:image" name="twitter:image" itemprop="image" content="https://madcampos.dev/icons/transparent/manifest-icon-512.png" />
<meta property="og:type" content="article" />
<meta property="og:locale" itemprop="inLanguage" content="en_US" />
<meta property="og:url" itemprop="url" content="{{url}}" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:dnt" content="on">
```

The Open Graph tags are the ones where `property` starts with `og:`. They are used by social media sites to display a preview of the page when sharing it.

The Schema.org properties, all those `itemprop` on the page are used by search engines to display rich results.

Aside from that there are the more common `<title>` and `<link>` tags.

## Conclusion

This is an extremely basic markup for a page, there is no "hero image" neither other metadata that may be needed. But it is a good starting point for a blog and it is [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) and quite accessible.

I hope in the future to add more features and improve on the markup.

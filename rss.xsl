<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
			<head>
				<title>
					<xsl:value-of select="/rss/channel/title"/>
				</title>
				<link rel="stylesheet" href="/css/base.css"/>
				<link rel="stylesheet" href="/css/xml-feed.css"/>
			</head>
			<body>
				<header>
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
					<h1 id="title">
						<a>
							<xsl:attribute name="href">
								<xsl:value-of select="/rss/channel/link"/>
							</xsl:attribute>
							<xsl:value-of select="/rss/channel/title"/>
						</a>
					</h1>
					<section id="metadata">
						<p>Last updated at: <em><xsl:value-of select="/rss/channel/lastBuildDate"/></em></p>

						<blockquote id="description">
							<small><em><xsl:value-of select="/rss/channel/description"/></em></small>
						</blockquote>
					</section>
				</header>

				<main>
					<xsl:for-each select="/rss/channel/item">
						<article>
							<h2>
								<a>
									<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
									<xsl:value-of select="title"/>
								</a>
							</h2>
							<aside>Published on: <em><xsl:value-of select="pubDate"/></em></aside>

							<xsl:if test="enclosure">
								<figure>
									<img>
										<xsl:attribute name="src">
											<xsl:value-of select="enclosure/@url"/>
										</xsl:attribute>
									</img>
									<figcaption>
										<xsl:value-of select="enclosure/@type"/>
									</figcaption>
								</figure>
							</xsl:if>

							<div><xsl:value-of select="description" disable-output-escaping="yes"/></div>
							<p><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>Read more...</a></p>

							<xsl:if test="category">
								<aside class="post-categories">
									<details>
										<summary>Post Tags</summary>
										<ul>
											<xsl:for-each select="category">
												<li>
													<xsl:value-of select="."/>
												</li>
											</xsl:for-each>
										</ul>
									</details>
								</aside>
							</xsl:if>
						</article>
					</xsl:for-each>
				</main>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>

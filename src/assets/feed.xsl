<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:media="http://search.yahoo.com/mrss/">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
			<head>
				<title>
					<xsl:value-of select="/rss/channel/title"/>
				</title>

				<!-- {{CSS}} -->

				<script type="module">
					const formatter = new Intl.DateTimeFormat(navigator.language, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric'
					});

					[...document.querySelectorAll('time')].forEach((time) => {
						const date = new Date(time.textContent);

						time.textContent = formatter.format(date);
						time.setAttribute('datetime', date.toISOString());
					});
				</script>
			</head>
			<body>
				<header id="feed-header">
					<a id="feed-image">
						<xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>

						<img>
							<xsl:attribute name="src"><xsl:value-of select="/rss/channel/image/url"/></xsl:attribute>
							<xsl:choose>
								<xsl:when test="/rss/channel/image/description">
									<xsl:attribute name="alt"><xsl:value-of select="/rss/channel/image/description"/></xsl:attribute>
								</xsl:when>
								<xsl:when test="/rss/channel/image/title">
									<xsl:attribute name="alt"><xsl:value-of select="/rss/channel/image/title"/></xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="alt">No image description</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>

							<xsl:choose>
								<xsl:when test="/rss/channel/image/width">
									<xsl:attribute name="width"><xsl:value-of select="/rss/channel/image/width"/></xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="width">88</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>

							<xsl:choose>
								<xsl:when test="/rss/channel/image/height">
									<xsl:attribute name="height"><xsl:value-of select="/rss/channel/image/height"/></xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="height">31</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
						</img>
					</a>

					<h1 id="feed-title">
						<a>
							<xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
							<xsl:value-of select="/rss/channel/title"/>
						</a>
					</h1>

					<section id="metadata">
						<xsl:choose>
							<xsl:when test="/rss/channel/lastBuildDate">
								Last updated at: <time><xsl:value-of select="/rss/channel/lastBuildDate"/></time>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="/rss/channel/pubDate">
									Last published at: <time><xsl:value-of select="/rss/channel/pubDate"/></time>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>

						<blockquote id="description">
							<small><em><xsl:value-of select="/rss/channel/description"/></em></small>
						</blockquote>
					</section>
				</header>

				<main>
					<xsl:for-each select="/rss/channel/item">
						<article class="item">
							<xsl:choose>
								<xsl:when test="media:content and media:content/@medium = 'image'">
									<picture>
										<img>
											<xsl:attribute name="src"><xsl:value-of select="media:content/@url"/></xsl:attribute>
											<xsl:attribute name="width"><xsl:value-of select="media:content/@width"/></xsl:attribute>
											<xsl:attribute name="height"><xsl:value-of select="media:content/@height"/></xsl:attribute>

											<xsl:choose>
												<xsl:when test="media:description">
													<xsl:attribute name="alt"><xsl:value-of select="media:description"/></xsl:attribute>
												</xsl:when>
												<xsl:when test="media:title">
													<xsl:attribute name="alt"><xsl:value-of select="media:title"/></xsl:attribute>
												</xsl:when>
												<xsl:when test="media:content/@title">
													<xsl:attribute name="alt"><xsl:value-of select="media:content/@title"/></xsl:attribute>
												</xsl:when>
												<xsl:otherwise>
													<xsl:attribute name="alt">No image description</xsl:attribute>
												</xsl:otherwise>
											</xsl:choose>
										</img>
									</picture>
								</xsl:when>
								<xsl:when test="enclosure">
									<xsl:for-each select="enclosure[position()=1]">
										<xsl:variable name="ext">
											<xsl:call-template name="extractFileExtension">
												<xsl:with-param name="url" select="normalize-space(./@url)"/>
											</xsl:call-template>
										</xsl:variable>

										<xsl:if test="$ext = 'jpg' or $ext = 'gif' or $ext = 'png' or $ext = 'jpeg' or $ext = 'webp'">
											<picture>
												<img width="200" height="200">
													<xsl:attribute name="src"><xsl:value-of select="./@url"/></xsl:attribute>

													<xsl:choose>
														<xsl:when test="media:description">
															<xsl:attribute name="alt"><xsl:value-of select="media:description"/></xsl:attribute>
														</xsl:when>
														<xsl:when test="media:title">
															<xsl:attribute name="alt"><xsl:value-of select="media:title"/></xsl:attribute>
														</xsl:when>
														<xsl:when test="media:content/@title">
															<xsl:attribute name="alt"><xsl:value-of select="media:content/@title"/></xsl:attribute>
														</xsl:when>
														<xsl:otherwise>
															<xsl:attribute name="alt">No image description</xsl:attribute>
														</xsl:otherwise>
													</xsl:choose>
												</img>
											</picture>
										</xsl:if>
									</xsl:for-each>
								</xsl:when>
							</xsl:choose>
							<header>
								<h2>
									<a>
										<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
										<xsl:value-of select="title"/>
									</a>
								</h2>

								<aside class="item-metadata">
									<xsl:if test="pubDate">
										<span>Published on: <time><xsl:value-of select="pubDate"/></time></span>
									</xsl:if>

									<xsl:if test="pubDate and author">
										<span> | </span>
									</xsl:if>

									<xsl:if test="author">
										<span><xsl:value-of select="author"/></span>
									</xsl:if>
								</aside>
							</header>

							<div class="item-content">
								<xsl:choose>
									<xsl:when test="description[@type='xhtml']">
										<xsl:copy-of select="description/*"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of disable-output-escaping="yes" select="description"/>
									</xsl:otherwise>
								</xsl:choose>

								<p><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>Read more...</a></p>
							</div>

							<footer>
								<xsl:if test="category">
									<details>
										<summary>Post Tags</summary>
										<ul>
											<xsl:for-each select="category">
												<li class="tag">
													<xsl:value-of select="."/>
												</li>
											</xsl:for-each>
										</ul>
									</details>
								</xsl:if>
							</footer>
						</article>
					</xsl:for-each>
				</main>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="extractFileExtension">
		<xsl:param name="url"/>
		<xsl:variable name="nextToken" select="substring-before($url, '.')"/>
		<xsl:variable name="rest" select="substring-after($url, '.')"/>

		<xsl:choose>
			<xsl:when test="contains($rest, '.')">
				<xsl:call-template name="extractFileExtension">
					<xsl:with-param name="url" select="$rest"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:variable name="lcletters">abcdefghijklmnopqrstuvwxyz</xsl:variable>
				<xsl:variable name="ucletters">ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>
				<xsl:value-of select="translate($rest,$ucletters,$lcletters)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>

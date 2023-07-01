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
				<link rel="stylesheet" href="/css/xml-changelog.css"/>
			</head>
			<body>
				<h1>
					<a>
						<xsl:attribute name="href">
							<xsl:value-of select="/rss/channel/link"/>
						</xsl:attribute>
						<xsl:value-of select="/rss/channel/title"/>
					</a>
				</h1>

				<main>
					<aside>
						<xsl:value-of select="/rss/channel/description"/>
					</aside>

					<xsl:for-each select="/rss/channel/item">
						<article>
							<h2>
								<xsl:value-of select="title"/>
							</h2>
							<aside>
								Released on:
								<em>
									<xsl:value-of select="pubDate"/>
								</em>
							</aside>

							<div>
								<xsl:value-of select="description" disable-output-escaping="yes"/>
							</div>
						</article>
					</xsl:for-each>
				</main>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>

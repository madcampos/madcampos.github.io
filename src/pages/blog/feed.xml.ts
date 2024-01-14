import type { APIRoute } from 'astro';

import { stat } from 'node:fs/promises';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { listAllPosts } from '../../utils/post';
import { getImage } from 'astro:assets';

import defaultImage from '../../assets/images/logo-blog-micro.png';

export const GET: APIRoute = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const TEN_KB_IN_BYTES = 10 * 1024;

  const blogImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });

  return rss({
    title: "Marco Campos' Blog",
    description: 'A space where I talk about web development, Vue.js, Node.js, TypeScript, JavaScript',
    site: context.site ?? '',
    items: await Promise.all((await listAllPosts()).map(async (post) => {
      let image;
      let imageSize = TEN_KB_IN_BYTES;

      if (post.data.image) {
        const originalFilePath = post.data.image.src.replace(/^\/@fs/ui, '').replace(/\?.+$/ui, '');

        image = await getImage({ src: post.data.image, format: 'png' });
        imageSize = (await stat(originalFilePath)).size;
      }

      const item: RSSFeedItem = {
        title: post.data.title,
        description: post.data.summary,
        pubDate: post.data.createdAt,
        categories: post.data.tags,
        link: `${context.site?.toString().replace(/\/$/u, '') ?? ''}/blog/${post.url}`,
        ...(image && {
          enclosure: {
            url: new URL(image.src, context.site).toString(),
            type: 'image/png',
            length: imageSize
          }
        })
      };

      return item;
    })),
    stylesheet: '/feed.xsl',
    customData: `
      <language>en-us</language>
      <image>
        <url>${new URL(blogImage.src, context.site).toString()}</url>
        <title>Marco Campos' Blog</title>
        <link>${context.site?.toString() ?? ''}</link>
        <width>${blogImage.options.width}</width>
        <height>${blogImage.options.height}</height>
      </image>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <ttl>${ONE_WEEK_IN_MINUTES}</ttl>
    `
  });
};

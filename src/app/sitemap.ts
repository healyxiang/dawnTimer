import { MetadataRoute } from "next";
// import { allBlogs } from "contentlayer/generated";
// import { allPosts, allDePosts, allCsPosts } from "contentlayer/generated";
import { allPosts } from "contentlayer/generated";

import siteMetadata from "@/data/siteMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl;
  const blogRoutes = allPosts.map((post) => ({
    url: `${siteUrl}${post.url.startsWith("/") ? post.url : `/${post.url}`}`,
    lastModified: post.date,
  }));

  const routes = ["", "pomodoro", "blog"].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogRoutes];
}

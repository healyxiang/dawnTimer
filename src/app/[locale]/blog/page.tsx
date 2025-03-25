import Link from "next/link";
import { Locale } from "next-intl";
import { use } from "react";
import { compareDesc, format, parseISO } from "date-fns";
import {
  allPosts,
  Post,
  allDePosts,
  DePost,
  allCsPosts,
  CsPost,
} from "contentlayer/generated";

// export const runtime = "edge";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const PostsLocaleMap = {
  en: allPosts,
  de: allDePosts,
  cs: allCsPosts,
};

function PostCard(post: Post | DePost | CsPost) {
  // console.log("post in post card:", post);
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={post.url}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(post.date), "LLLL d, yyyy")}
      </time>
      <div>{post.summary}</div>
    </div>
  );
}

export default function BlogListPage({ params }: Props) {
  // console.log("allPosts :", allPosts);
  const { locale } = use(params);
  console.log("locale in blog page:", locale);
  const posts = PostsLocaleMap[locale as keyof typeof PostsLocaleMap].sort(
    (a, b) => compareDesc(new Date(a.date), new Date(b.date))
  );
  // console.log("posts :", posts);

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* <h1 className="mb-8 text-center text-2xl font-black">Next.js + Contentlayer Example</h1> */}
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
}

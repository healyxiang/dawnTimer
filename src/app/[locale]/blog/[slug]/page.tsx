import { format, parseISO } from "date-fns";
import { allPosts, allDePosts, allCsPosts } from "contentlayer/generated";
import { redirect } from "next/navigation";
// import { MDXProvider } from '@mdx-js/react'

// export const generateStaticParams = async () => {
//   return Promise.resolve(
//     allPosts.map((post) => ({ slug: post._raw.flattenedPath }))
//   );
// };

// export const runtime = "edge";
type Params = Promise<{ slug: string; locale: string }>;

const PostsLocaleMap = {
  en: allPosts,
  de: allDePosts,
  cs: allCsPosts,
};

function getPost(slug: string, locale: string) {
  return PostsLocaleMap[locale as keyof typeof PostsLocaleMap]?.find(
    (post) => post._raw.sourceFileName.replace(".mdx", "") === slug
  );
}

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { slug, locale } = await params;
  const post = getPost(slug, locale);

  return post
    ? { title: `Yt2Pod - ${post.title}`, description: post.summary }
    : { title: "404", description: "404" };
};

const PostLayout = async ({ params }: { params: Params }) => {
  const { slug, locale } = await params;
  const post = getPost(slug, locale);
  if (!post) return redirect("/404");
  return (
    // <MDXProvider>
    <article className="prose mx-auto max-w-xl py-8 dark:prose-invert">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs ">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div
        className="[&>*:last-child]:mb-0 [&>*]:mb-3"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </article>
    // </MDXProvider>
  );
};

export default PostLayout;

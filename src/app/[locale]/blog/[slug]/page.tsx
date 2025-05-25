import { allPosts, allDePosts, allCsPosts } from "contentlayer/generated";
// import { MDXLayoutRenderer } from "pliny/mdx-components";
// import { components } from "@/components/MDXComponents";

import { redirect } from "next/navigation";
import PostSimple from "@/components/blog/layouts/PostSimple";
import { BlogContent } from "@/components/blog/BlogContent";

// export const generateStaticParams = async () => {
//   return Promise.resolve(
//     allPosts.map((post) => ({ slug: post._raw.flattenedPath }))
//   );
// };

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
    ? { title: `DawnLibrary - ${post.title}`, description: post.summary }
    : { title: "404", description: "404" };
};

const PostLayout = async ({ params }: { params: Params }) => {
  const { slug, locale } = await params;
  const post = getPost(slug, locale);

  if (!post) return redirect("/404");
  const mainContent = {
    date: post.date,
    title: post.title,
  };

  if (!mainContent) {
    console.error("mainContent is undefined");
    return <div>Error loading content</div>;
  }

  // 可以添加loading状态
  if (mainContent === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <PostSimple content={mainContent}>
      <BlogContent
        className="[&>*:last-child]:mb-0 [&>*]:mb-3"
        html={post.body.html}
      />
    </PostSimple>
  );
};

export default PostLayout;

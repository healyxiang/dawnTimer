// contentlayer.config.ts
import {
  defineDocumentType,
  makeSource,
  ComputedFields,
} from "contentlayer/source-files";

import { extractTocHeadings } from "pliny/mdx-plugins/index.js";

const computedFields: ComputedFields = {
  // readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
  },
  path: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: "string",
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: "string", resolve: (doc) => extractTocHeadings(doc.body.raw) },
};

const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `/en/**/*.mdx`,
  // contentType: "mdx",
  contentType: "markdown",
  fields: {
    type: { type: "string", required: true },
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
  },
  computedFields: {
    ...computedFields,
    url: {
      type: "string",
      resolve: (post) => {
        console.log("post._raw:", post._raw);
        // return `/blog/${post._raw.flattenedPath}`;
        return `/blog/${post._raw.sourceFileName.replace(".mdx", "")}`;
      },
    },
    lang: {
      type: "string",
      resolve: () => "en", // 标记语言为英文
    },
  },
}));

const DePost = defineDocumentType(() => ({
  name: "DePost",
  filePathPattern: `/de/**/*.mdx`,
  // contentDirPath: "src/posts/de",
  // contentType: "mdx",
  contentType: "markdown",
  fields: {
    type: { type: "string", required: true },
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
  },
  computedFields: {
    ...computedFields,
    url: {
      type: "string",
      // resolve: (post) => `/blog/${post._raw.flattenedPath}`,
      resolve: (post) =>
        `/blog/${post._raw.sourceFileName.replace(".mdx", "")}`,
    },
    lang: {
      type: "string",
      resolve: () => "de", // 标记语言为德语
    },
  },
}));

const CsPost = defineDocumentType(() => ({
  name: "CsPost",
  filePathPattern: `/cs/**/*.mdx`,
  // contentDirPath: "src/posts/de",
  // contentType: "mdx",
  contentType: "markdown",
  fields: {
    type: { type: "string", required: true },
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    summary: { type: "string", required: true },
  },
  computedFields: {
    ...computedFields,
    url: {
      type: "string",
      // resolve: (post) => `/blog/${post._raw.flattenedPath}`,
      resolve: (post) =>
        `/blog/${post._raw.sourceFileName.replace(".mdx", "")}`,
    },
    lang: {
      type: "string",
      resolve: () => "cs", // 标记语言为
    },
  },
}));

export default makeSource({
  contentDirPath: "src/posts",
  documentTypes: [Post, DePost, CsPost],
});

import { cn } from "@/lib/utils";

interface BlogContentProps {
  html: string;
  className?: string;
}

export function BlogContent({ html, className }: BlogContentProps) {
  // 处理 HTML 中的图片标签
  return (
    <article
      className={cn(
        // 基础排版样式
        "prose dark:prose-invert max-w-none",
        // 标题样式
        "prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4",
        "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-4",
        // 段落样式
        "prose-p:leading-7",
        // 列表样式
        "prose-li:my-2",
        "prose-ul:mt-6 prose-ul:mb-6 prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:mt-6 prose-ol:mb-6 prose-ol:list-decimal prose-ol:pl-6",
        // 链接样式
        "prose-a:font-medium prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80",
        // 引用样式
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:pl-4 prose-blockquote:italic",
        // 图片样式
        "prose-img:rounded-lg prose-img:border prose-img:border-muted",
        // 表格样式
        "prose-table:mt-6 prose-table:mb-6 prose-table:overflow-x-auto",
        "prose-th:border prose-th:border-muted prose-th:p-2 prose-th:bg-muted/50",
        "prose-td:border prose-td:border-muted prose-td:p-2",
        // 水平线样式
        "prose-hr:my-8 prose-hr:border-muted",
        // 间距控制
        "[&>*:last-child]:mb-0 [&>*]:mb-3",
        "prose-img:mx-auto prose-img:w-1/2",
        // 自定义类名
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

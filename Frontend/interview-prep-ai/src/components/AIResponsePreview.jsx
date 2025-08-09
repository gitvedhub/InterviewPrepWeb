import React, { useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIResponsePreview = ({ title, content }) => {
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {title && (
        <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2">
          {title}
        </h2>
      )}

      <div className="text-[14px] prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={match[1]}
                />
              ) : (
                <code
                  className="px-1 py-0.5 bg-gray-100 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p: ({ children }) => <p className="mb-4 leading-5">{children}</p>,
            strong: ({ children }) => <strong>{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            ul: ({ children }) => (
              <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
                {children}
              </blockquote>
            ),
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-bold mt-4 mb-2">{children}</h4>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-200">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
            tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
            tr: ({ children }) => <tr>{children}</tr>,
            th: ({ children }) => (
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 whitespace-nowrap text-sm">{children}</td>
            ),
            hr: () => <hr className="my-6 border-gray-200" />,
            img: ({ src, alt }) => (
              <img src={src} alt={alt} className="my-4 max-w-full rounded" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded overflow-hidden mb-4">
      <div className="flex justify-between items-center bg-gray-50 px-3 py-1 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <LuCode size={14} />
          <span>{language || "Code"}</span>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          aria-label="Copy Code"
        >
          {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
          {copied && <span>Copied!</span>}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 12.5,
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AIResponsePreview;

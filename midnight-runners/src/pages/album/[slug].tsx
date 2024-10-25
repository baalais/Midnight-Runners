import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogs } from "../../utils/fetchBlogs";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "~/components/Loading";

const BlogPost: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blogPost, setBlogPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatSlug = (slug?: string) => {
    if (!slug) return '';
    return slug
      .replace(/\/v1\//g, '/')
      .replace(/\/[^/]+$/, '');
  };

  const formatImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return ''; 
    const formattedUrl = imageUrl
      .replace('wix:image://', 'https://static.wixstatic.com/media/')
      .replace('/v1/', '/')
      .split('#')[0]
      .split('/')
      .slice(0, -1)
      .join('/');
    return formattedUrl.endsWith('.png') ? formattedUrl : `${formattedUrl}.png`;
  };

  useEffect(() => {
    const getBlogPost = async () => {
      const blogPosts = await fetchBlogs();
      const post = blogPosts.find((b: any) => b.slug === formatSlug(slug as string));
      setBlogPost(post);
      setLoading(false);
    };
    if (slug) {
      getBlogPost();
    }
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (!blogPost) {
    return <div className="text-center">Blog post not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold mb-4">{blogPost.slug}</h1>
        {blogPost.coverImage && blogPost.coverImage.url && (
          <img
            src={formatImageUrl(blogPost.coverImage.url)}
            alt={blogPost.slug}
            className="w-full h-72 object-contain mb-4"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        <p className="text-gray-600 mb-4">{blogPost.excerpt}</p>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Content</h2>
          {blogPost.richContent?.nodes.map((node: any) => (
            <div key={node.id}>
              {node.type === "PARAGRAPH" && node.nodes[0]?.textData?.text && (
                <p className="text-gray-700 mb-4">{node.nodes[0].textData.text}</p>
              )}
              {node.type === "HEADING" && node.nodes[0]?.textData?.text && (
                <h3 className="text-2xl font-bold mt-4 mb-2">{node.nodes[0].textData.text}</h3>
              )}
              {node.type === "BULLETED_LIST" && (
                <ul className="list-disc pl-5 mb-4">
                  {node.nodes.map((listItem: any) => (
                    <li key={listItem.id} className="text-gray-700 mb-2">
                      {listItem.nodes.map((paragraph: any) => (
                        paragraph.nodes[0]?.textData?.text && (
                          <p key={paragraph.id} className="text-gray-700 mb-2">
                            {paragraph.nodes[0].textData.text}
                          </p>
                        )
                      ))}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

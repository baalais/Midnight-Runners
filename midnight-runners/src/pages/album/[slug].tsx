import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogs } from "../../utils/fetchBlogs";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "~/components/Loading"; // Adjust the import path as needed

const BlogPost: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blogPost, setBlogPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogPost = async () => {
      const blogPosts = await fetchBlogs();
      const post = blogPosts.find((b: any) => b.slug === slug);
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

  const formatImageUrl = (imageUrl: string) => {
    return imageUrl.replace('wix:image://v1/', 'https://static.wixstatic.com/media/').split('#')[0];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold mb-4">{blogPost.slug}</h1>
        {blogPost.coverImage && (
          <img
            src={formatImageUrl(blogPost.coverImage)}
            alt={blogPost.slug}
            className="w-full h-72 object-cover mb-4"
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

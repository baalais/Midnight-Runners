import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../../utils/fetchBlogs"; 
import Link from "next/link";
import Header from "~/components/header"; 
import Footer from "~/components/footer"; 
import Loading from "~/components/Loading"; // Adjust the import path as needed

const Album: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogPosts = await fetchBlogs();
        setBlogs(blogPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
              {blog.coverImage && (
                <img
                  src={blog.coverImage.replace('wix:image://', 'https://static.wixstatic.com/media/') + '?format=jpg'}
                  alt={blog.slug}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-2xl font-semibold mt-2">{blog.slug}</h2>
                <p className="text-gray-700 mb-4">{blog.excerpt}</p>
                <Link href={`/album/${blog.slug}`}>
                  <span className="text-teal-500 hover:underline cursor-pointer">Read more</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Album;

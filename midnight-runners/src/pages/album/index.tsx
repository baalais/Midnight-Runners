import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../../utils/fetchBlogs";
import Link from "next/link";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "~/components/Loading";

// Album komponentes definīcija
const Album: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]); // Stāvoklis, lai uzglabātu bloga ierakstus
  const [loading, setLoading] = useState(true); // Ielādes stāvoklis

  // Funkcija, lai iegūtu bloga ierakstus
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogPosts = await fetchBlogs(); // Iegūst bloga ierakstus
        setBlogs(blogPosts); // Saglabā iegūtos ierakstus stāvoklī
      } catch (error) {
        console.error("Failed to fetch blog posts:", error); // Izvada kļūdu konsolē
      } finally {
        setLoading(false); // Beidz ielādes stāvokli
      }
    };
    getBlogs(); // Izsauc funkciju, lai iegūtu bloga ierakstus
  }, []);

  // Ja ielādē, parāda Loading komponentu
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Parāda galveni */}
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold text-center mb-8">Blog Posts</h1> {/* Virsraksts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            // Formāta attēla URL
            let imageUrl = blog.coverImage 
              ? blog.coverImage
                  .replace('wix:image://', 'https://static.wixstatic.com/media/') // Nomaina sākuma daļu
                  .replace('/v1/', '/') // Noņem /v1/
                  .split('#')[0] // Noņem jebkādas vaicājuma daļas
                  .split('/').slice(0, -1).join('/') // Noņem pēdējo daļu
              : 'https://static.wixstatic.com/media/be6ced_bcff3b85ac9e4882b8afd3d852842f7f~mv2.png'; // Noklusējuma attēls

            console.log('Formatted Image URL:', imageUrl); // Debugging output

            return (
              <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={blog.slug}
                    className="w-full h-48 object-contain" // Izmanto 'object-contain', lai attēls netiktu sagriezts
                    onError={(e) => {
                      e.currentTarget.src = '/fallback.png'; // Izmanto noklusējuma attēlu, ja notiek kļūda
                    }}
                  />
                )}
                <div className="p-4">
                  <h2 className="text-2xl font-semibold mt-2">{blog.slug}</h2> {/* Bloga virsraksts */}
                  <p className="text-gray-700 mb-4">{blog.excerpt}</p> {/* Bloga īss apraksts */}
                  <Link href={`/album/${blog.slug}`}>
                    <span className="text-teal-500 hover:underline cursor-pointer">Read more</span> {/* Saite uz pilnu rakstu */}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer /> {/* Parāda kājējo informāciju */}
    </div>
  );
};

export default Album;

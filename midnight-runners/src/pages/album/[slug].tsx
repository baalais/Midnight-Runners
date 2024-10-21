import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogs } from "../../utils/fetchBlogs";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "~/components/Loading";

const BlogPost: React.FC = () => {
  const router = useRouter(); // Iegūst maršrutu
  const { slug } = router.query; // Iegūst slug no vaicājuma parametriem
  const [blogPost, setBlogPost] = useState<any>(null); // Iestatījumus bloga ierakstiem
  const [loading, setLoading] = useState(true); // Iestatījumi ielādes stāvoklim

  useEffect(() => {
    const getBlogPost = async () => {
      const blogPosts = await fetchBlogs(); // Iegūst bloga ierakstus
      const post = blogPosts.find((b: any) => b.slug === slug); // Meklē konkrētu ierakstu pēc slug
      setBlogPost(post); // Iestata atrasto bloga ierakstu
      setLoading(false); // Iestata ielādes stāvokli uz false
    };

    if (slug) {
      getBlogPost(); // Iegūst bloga ierakstu, ja slug ir pieejams
    }
  }, [slug]);

  if (loading) {
    return <Loading />; // Ja ielādē, atgriež Loading komponentu
  }

  if (!blogPost) {
    return <div className="text-center">Blog post not found.</div>; // Ja bloga ieraksts nav atrasts
  }

  // Funkcija, lai formatētu attēla URL
  const formatImageUrl = (imageUrl: string) => {
    return imageUrl
      .replace("wix:image://v1/", "https://static.wixstatic.com/media/")
      .split("#")[0]; // Atgriež pareizo URL
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Parāda Header komponentu */}
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold mb-4">{blogPost.slug}</h1> {/* Parāda bloga ieraksta virsrakstu */}
        {blogPost.coverImage && (
          <img
            src={formatImageUrl(blogPost.coverImage)} // Formātē attēla URL
            alt={blogPost.slug}
            className="w-full h-72 object-cover mb-4" // CSS klases
          />
        )}
        <p className="text-gray-600 mb-4">{blogPost.excerpt}</p> {/* Parāda īsu aprakstu */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Content</h2> {/* Sadaļa ar saturu */}
          {blogPost.richContent?.nodes.map((node: any) => ( // Iterē cauri satura mezgliem
            <div key={node.id}>
              {node.type === "PARAGRAPH" && node.nodes[0]?.textData?.text && (
                <p className="text-gray-700 mb-4">{node.nodes[0].textData.text}</p> // Parāda paragrāfus
              )}
              {node.type === "HEADING" && node.nodes[0]?.textData?.text && (
                <h3 className="text-2xl font-bold mt-4 mb-2">{node.nodes[0].textData.text}</h3> // Parāda virsrakstus
              )}
              {node.type === "BULLETED_LIST" && (
                <ul className="list-disc pl-5 mb-4"> {/* Parāda sarakstus ar punktiem */}
                  {node.nodes.map((listItem: any) => (
                    <li key={listItem.id} className="text-gray-700 mb-2">
                      {listItem.nodes.map((paragraph: any) => (
                        paragraph.nodes[0]?.textData?.text && (
                          <p key={paragraph.id} className="text-gray-700 mb-2">
                            {paragraph.nodes[0].textData.text} {/* Parāda saraksta elementus */}
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
      <Footer /> {/* Parāda Footer komponentu */}
    </div>
  );
};

export default BlogPost; // Eksportē BlogPost komponentu

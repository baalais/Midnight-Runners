import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogs } from "../../utils/fetchBlogs";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "~/components/Loading";

// BlogPost komponentes definīcija
const BlogPost: React.FC = () => {
  const router = useRouter(); // Iegūst maršruta informāciju
  const { slug } = router.query; // Iegūst slug no URL
  const [blogPost, setBlogPost] = useState<any>(null); // Stāvoklis bloga ierakstam
  const [loading, setLoading] = useState(true); // Ielādes stāvoklis

  // Funkcija, lai formatētu slug URL
  const formatSlug = (slug: string) => {
    if (!slug) return ''; // Apstrādā gadījumus, kad slug var būt undefined
    return slug
      .replace(/\/v1\//g, '/') // Noņem jebkādas '/v1/' daļas
      .replace(/\/[^/]+$/, ''); // Noņem visu pēc pēdējā '/'
  };

  // Funkcija, lai formatētu attēla URL
  const formatImageUrl = (imageUrl: string) => {
    const formattedUrl = imageUrl
      .replace('wix:image://', 'https://static.wixstatic.com/media/') // Nomaina sākuma daļu
      .replace('/v1/', '/') // Noņem /v1/
      .split('#')[0] // Noņem jebkādas vaicājuma daļas
      .split('/').slice(0, -1).join('/'); // Noņem pēdējo daļu

    // Pārliecinās, ka URL beidzas ar .png
    return formattedUrl.endsWith('.png') ? formattedUrl : `${formattedUrl}.png`; 
  };

  // Funkcija, lai iegūtu konkrētu bloga ierakstu
  useEffect(() => {
    const getBlogPost = async () => {
      const blogPosts = await fetchBlogs(); // Iegūst visus bloga ierakstus
      const post = blogPosts.find((b: any) => b.slug === formatSlug(slug)); // Meklē ierakstu pēc slug
      setBlogPost(post); // Saglabā atrasto ierakstu
      setLoading(false); // Beidz ielādes stāvokli
    };

    if (slug) {
      getBlogPost(); // Izsauc funkciju, ja slug ir pieejams
    }
  }, [slug]);

  // Ja ielādē, parāda Loading komponentu
  if (loading) {
    return <Loading />;
  }

  // Ja bloga ieraksts nav atrasts
  if (!blogPost) {
    return <div className="text-center">Blog post not found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Parāda galveni */}
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold mb-4">{blogPost.slug}</h1> {/* Bloga virsraksts */}
        {blogPost.coverImage && (
          <img
            src={formatImageUrl(blogPost.coverImage)} // Formāts attēla URL
            alt={blogPost.slug} // Attēla alternatīvais teksts
            className="w-full h-72 object-contain mb-4" // Izmanto 'object-contain', lai attēls netiktu sagriezts
            style={{ width: '100%', height: 'auto' }} // Uztur aspektu attiecību
          />
        )}
        <p className="text-gray-600 mb-4">{blogPost.excerpt}</p> {/* Īss apraksts par blogu */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Content</h2> {/* Satura virsraksts */}
          {blogPost.richContent?.nodes.map((node: any) => (
            <div key={node.id}>
              {node.type === "PARAGRAPH" && node.nodes[0]?.textData?.text && (
                <p className="text-gray-700 mb-4">{node.nodes[0].textData.text}</p> // Paragrāfs
              )}
              {node.type === "HEADING" && node.nodes[0]?.textData?.text && (
                <h3 className="text-2xl font-bold mt-4 mb-2">{node.nodes[0].textData.text}</h3> // Virsraksts
              )}
              {node.type === "BULLETED_LIST" && (
                <ul className="list-disc pl-5 mb-4"> {/* Saraksts ar punktiem */}
                  {node.nodes.map((listItem: any) => (
                    <li key={listItem.id} className="text-gray-700 mb-2">
                      {listItem.nodes.map((paragraph: any) => (
                        paragraph.nodes[0]?.textData?.text && (
                          <p key={paragraph.id} className="text-gray-700 mb-2">
                            {paragraph.nodes[0].textData.text} {/* Saraksta elements */}
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
      <Footer /> {/* Parāda kājējo informāciju */}
    </div>
  );
};

export default BlogPost; // Eksportē BlogPost komponenti

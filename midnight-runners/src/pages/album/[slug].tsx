/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBlogs } from "../../utils/fetchBlogs";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "~/components/Loading";

const BlogPost: React.FC = () => {
  const router = useRouter(); // Iegūst router objektu
  const { slug } = router.query; // Iegūst slug no URL
  const [blogPost, setBlogPost] = useState<any>(null); // Stāvoklis, lai saglabātu bloga ierakstu
  const [loading, setLoading] = useState(true); // Stāvoklis, lai norādītu, vai dati tiek ielādēti

  useEffect(() => {
    const getBlogPost = async () => {
      try {
        const blogPosts = await fetchBlogs(); // Ielādē visus bloga ierakstus
        const post = blogPosts.find((b: any) => b.slug === slug); // Meklē ierakstu ar atbilstošo slug
        setBlogPost(post); // Saglabā atrasto ierakstu stāvoklī
        console.log('Blog post:', post); // Debugging izsniegums
      } catch (error) {
        console.error("Failed to fetch blog post:", error); // Izsniegums kļūdas gadījumā
      } finally {
        setLoading(false); // Beidz ielādes stāvokli
      }
    };
    if (slug) getBlogPost(); // Ja slug ir pieejams, izsauc funkciju
  }, [slug]);

  if (loading) return <Loading />; // Ja dati tiek ielādēti, attēlo Loading komponentu

  if (!blogPost) return <div className="text-center">Blog post not found.</div>; // Ja bloga ieraksts nav atrasts

  // Pārliecinās, ka vāka attēls ir pareizi formatēts
  const imageUrl = blogPost.coverImage
    ? blogPost.coverImage
        .replace('wix:image://', 'https://static.wixstatic.com/media/') // Nomaina sākuma daļu
        .replace('/v1/', '/') // Noņem /v1/
        .split('#')[0] // Noņem jebkādas vaicājuma daļas
        .split('/').slice(0, -1).join('/') // Noņem pēdējo daļu
    : 'https://static.wixstatic.com/media/be6ced_bcff3b85ac9e4882b8afd3d852842f7f~mv2.png'; // Fallback attēls

  console.log('Cover image URL:', imageUrl); // Debugging izsniegums

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Attēlo galveni */}
      <main className="container mx-auto px-4 md:px-8 py-10 flex-grow">
        <h1 className="text-4xl font-bold mb-4">{blogPost.slug}</h1> {/* Bloga ieraksta nosaukums */}
        {imageUrl && ( // Pārbauda, vai attēla URL ir pieejams
          <img
            src={imageUrl} // Attēlo vāka attēlu
            alt={blogPost.slug}
            className="w-full h-72 object-contain mb-4"
          />
        )}
        <p className="text-gray-600 mb-4">{blogPost.excerpt}</p> {/* Attēlo īsu aprakstu */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Content</h2> {/* Sadaļa saturam */}
          {blogPost.richContent?.nodes.map((node: any) => ( // Iterē cauri bagātīga satura mezgliem
            <div key={node.id}>
              {node.type === "PARAGRAPH" && node.nodes[0]?.textData?.text && ( // Pārbauda, vai mezgls ir paragrāfs
                <p className="text-gray-700 mb-4">{node.nodes[0].textData.text}</p> // Attēlo paragrāfus
              )}
              {node.type === "HEADING" && node.nodes[0]?.textData?.text && ( // Pārbauda, vai mezgls ir virsraksts
                <h3 className="text-2xl font-bold mt-4 mb-2">{node.nodes[0].textData.text}</h3> // Attēlo virsrakstus
              )}
              {node.type === "BULLETED_LIST" && ( // Pārbauda, vai mezgls ir saraksts
                <ul className="list-disc pl-5 mb-4">
                  {node.nodes.map((listItem: any) => ( // Iterē cauri saraksta elementiem
                    <li key={listItem.id} className="text-gray-700 mb-2">
                      {listItem.nodes.map((paragraph: any) => ( // Iterē cauri paragrāfiem saraksta elementā
                        paragraph.nodes[0]?.textData?.text && ( // Pārbauda, vai paragrāfs satur tekstu
                          <p key={paragraph.id} className="text-gray-700 mb-2">
                            {paragraph.nodes[0].textData.text} // Attēlo saraksta elementus
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
      <Footer /> {/* Attēlo kājeni */}
    </div>
  );
};

export default BlogPost; // Eksportē BlogPost komponentu

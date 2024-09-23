/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import React, { useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import styles from "../../styles/AlbumPage.module.css"; // Adjust the path as needed

export default function Album({ feed }: any) {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const openModal = (media: any) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  // Filter posts that don't appear to be a collab
  const media = feed.data.filter((item: any) => {
    // Example check: skipping items with missing caption or media_url (potential collab posts)
    if (!item.caption || item.media_url === 'white_image_url_placeholder') {
      return false; // Skip this post
    }
    return true; // Keep this post
  });

  return (
    <>
      <Head>
        <title>Album</title>
        <meta name="description" content="Album page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className={styles.container}>
        <h1 className={styles.albumTitle}>Instagram Album</h1>
        
        {/* Apply the Tailwind-like responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl px-4 sm:px-6 gap-3 mx-auto">
          {media?.map((item: any) => (
            <div className={styles.mediaItem} key={item.id}>
              {item.media_type === "IMAGE" && (
                <div onClick={() => openModal(item)}>
                  <img
                    src={item.media_url}
                    alt={item.caption}
                    className={styles.image}
                  />
                </div>
              )}
              {item.media_type === "VIDEO" && (
                <div onClick={() => openModal(item)}>
                  <video
                    className={styles.video}
                    muted
                    onMouseEnter={(e) => (e.currentTarget.muted = false)}
                    onMouseLeave={(e) => (e.currentTarget.muted = true)}
                  >
                    <source src={item.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedMedia && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {selectedMedia.media_type === "IMAGE" && (
              <img
                src={selectedMedia.media_url}
                alt={selectedMedia.caption}
                className={styles.modalImage}
              />
            )}
            {selectedMedia.media_type === "VIDEO" && (
              <video controls className={styles.modalVideo}>
                <source src={selectedMedia.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <p className={styles.caption}>{selectedMedia.caption}</p>
            <a
              href={selectedMedia.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramLink}
            >
              Go to Instagram Post
            </a>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
export const getStaticProps = async () => {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`;
  const data = await fetch(url);
  const feed = await data.json();

  return {
    props: {
      feed,
    },
  };
};
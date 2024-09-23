import Head from "next/head";
import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import styles from "../../styles/AlbumPage.module.css"; // Adjust the path as needed

export default function Album({ feed }: any) {
  console.log(feed);
  return (
    <>
      <Head>
        
        <title>Album</title>
        <meta name="description" content="Album page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Album Page</h1>
          <NavBar blog={false} />
          <div className={styles.media}>
          {images && images.map((image:any) => (
            <div><img src={image.media_url} alt={image.caption} key={} /></div>
          ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export const getStaticProps = async () => {
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,permalink&access_token=${process.env.INSTAGRAM_KEY}`;
  const data = await fetch(url)
  const feed = await data.json();

  return{
    props: {
      feed,
    }
  }
};

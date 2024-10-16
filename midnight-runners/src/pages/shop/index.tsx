import Head from "next/head";
import Footer from "../../components/footer";
import dynamic from 'next/dynamic';
import Header from "~/components/header";

const InstagramFeed = dynamic(() => import('../../components/InstagramFeed'), { ssr: false });

const SocialPage = () => {
  return (
    <div>
      <Head>
        <title>Follow Us on Instagram</title>
      </Head>
      <Header />
      <div>
        <h1>Follow Us on Instagram</h1>
        <InstagramFeed username="midnightrunnerslatvija" /> {/* Replace with your actual username */}
      </div>
      <Footer />
    </div>
  );
};

export default SocialPage;

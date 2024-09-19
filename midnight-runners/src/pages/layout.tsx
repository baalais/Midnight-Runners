import './Styles.css';
import Head from './head';
import Header from './shop/header';
import Footer from './shop/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head/>
      <body>
        <Header/>
        {children}
      <Footer/>
      </body>
    </html>
  )
}
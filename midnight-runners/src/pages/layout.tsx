import './Styles.css';
import Head from './head';
import Header from './common/header';
import Footer from './common/footer';

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
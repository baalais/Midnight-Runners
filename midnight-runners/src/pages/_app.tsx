import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import "~/styles/globals.css";
import { WixClientContextProvider } from "../context/wixContext"; // Adjust the import path if needed

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WixClientContextProvider> {/* Wrap your application in the context provider */}
      <div className={GeistSans.className}>
        <Component {...pageProps} />
      </div>
    </WixClientContextProvider>
  );
};

export default MyApp;

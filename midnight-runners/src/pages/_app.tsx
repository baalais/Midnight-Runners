import { GeistSans } from "geist/font/sans"; // Importē GeistSans fontu
import { type AppType } from "next/app";

import "~/styles/globals.css"; // Importē globālo stilu
import { WixClientContextProvider } from "../context/wixContext"; // Importē Wix klienta konteksta nodrošinātāju

// Galvenā MyApp komponente
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WixClientContextProvider> {/* Ietver lietojumprogrammu konteksta nodrošinātājā */}
      <div className={GeistSans.className}> {/* Lieto GeistSans fontu visā aplikācijā */}
        <Component {...pageProps} /> {/* Renderē pašreizējo lapu ar tās rekvizītiem */}
      </div>
    </WixClientContextProvider>
  );
};

export default MyApp; // Eksportē MyApp komponenti

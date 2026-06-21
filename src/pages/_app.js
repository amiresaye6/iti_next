import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "@/components/Header";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  // Hide navbar on 404 or other error pages
  const isErrorPage = router.pathname === "/404" || router.pathname === "/_error";

  return (
    <>
      {!isErrorPage && <Header />}
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}


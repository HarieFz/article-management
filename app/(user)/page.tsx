import SearchProvider from "@/contexts/SearchProvider";
import Articles from "./components/Articles";
import Footer from "./components/Footer";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <SearchProvider>
        <main>
          <Hero />
          <Articles />
        </main>
      </SearchProvider>
      <Footer />
    </>
  );
}

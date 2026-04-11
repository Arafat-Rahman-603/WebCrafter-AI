import SingleArticlePage from "@/page/SingleArticlePage";

export const metadata = {
  title: "Article | WebCrafter AI",
  description: "Read the latest insights from WebCrafter AI.",
};

export default function Article({ params }) {
  // Pass params to SingleArticlePage if needed, or rely on useParams in the client component.
  return <SingleArticlePage />;
}

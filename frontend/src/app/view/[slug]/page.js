import ViewPage from "@/page/ViewPage";

export const metadata = {
  title: "View | WebCrafter AI",
  description: "View your deployed AI-generated website.",
};

export default function View({ params }) {
  return <ViewPage params={params} />;
}

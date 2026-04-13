import EditorPage from "@/page/EditorPage";

export const metadata = {
  title: "Editor | WebCrafter AI",
  description: "Live preview and AI-powered editor for your generated website.",
};

export default function Editor({ params }) {
  return <EditorPage params={params} />;
}

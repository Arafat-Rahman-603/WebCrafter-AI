import SingleCareerPage from "@/page/SingleCareerPage";

export const metadata = {
  title: "Job Details | WebCrafter AI",
  description: "View job opening details at WebCrafter AI.",
};

export default function Job({ params }) {
  // Uses useParams inside the client component
  return <SingleCareerPage />;
}

import HomePage from "@/page/HomePage"; 
import Script from "next/script";

export default function Home() {
  return (
    <>
      <HomePage />
      <Script
          src="https://aether-ai-support.vercel.app/AetherAI.js"
          data-business-id="user_3DOvzYegtE9X4o0YzrpUjAF0ymN" 
      />
    </>
  );
}

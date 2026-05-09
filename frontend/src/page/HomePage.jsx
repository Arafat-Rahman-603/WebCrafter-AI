import Navber from "@/componentes/Navber";
import Hero from "@/componentes/Hero";
import Script from "next/script";

export default function HomePage() {
  return (
    <>
    <Navber />
    <Hero />
       <Script
          src="https://aether-ai-support.vercel.app/AetherAI.js"
          data-business-id="user_3DOvzYegtE9X4o0YzrpUjAF0ymN" 
      />
    </>
  )
}

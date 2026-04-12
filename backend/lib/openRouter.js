import dotenv from "dotenv";
dotenv.config();

export const generateWebsiteCode = async (prompt, theme, type) => {
  const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
  const model = "nvidia/nemotron-3-super-120b-a12b:free";

  const systemPrompt = `You are an expert frontend web developer specializing in HTML and Tailwind CSS.
Your task is to generate a single, completely functional HTML file containing a ${type} using the ${theme} theme.

Requirements:
- Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>).
- Include any necessary icons (e.g., FontAwesome or Heroicons via CDN).
- Include any necessary Google Fonts.
- Ensure the design is responsive and modern.
- Only return the raw HTML code, without any markdown formatting or explanations.`;

  const userPrompt = `Create a ${type} with a ${theme} theme. User request: ${prompt}`;

  try {
    const response = await fetch(openRouterUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`OpenRouter API responded with status: ${response.status}`);
    }

    const data = await response.json();
    let code = data.choices[0].message.content;

    // Remove markdown code block formatting if present
    if (code.startsWith('```')) {
      code = code.replace(/^```(html)?\n?/g, '').replace(/\n?```$/g, '');
    }

    return code;
  } catch (error) {
    console.error("Error generating website code:", error);
    throw error;
  }
};

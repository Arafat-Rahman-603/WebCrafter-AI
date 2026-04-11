const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

const model = "nvidia/nemotron-3-super-120b-a12b:free";

let response = await fetch(openRouterUrl, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "anthropic/claude-sonnet",
    "messages": [
      {
        "role": "user",
        "content": "How many r's are in the word 'strawberry'?"
      }
    ],
    "reasoning": {"enabled": true}
  })
});


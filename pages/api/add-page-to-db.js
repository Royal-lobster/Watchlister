export default async function handler(req, res) {
  try {
    if (req.method !== "POST" || !req.body.token || !req.body.body_content) {
      res.status(400).json({ error: "Invalid request or missing parameters." });
      return;
    }

    const { token, body_content } = req.body;

    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2021-08-16",
        Authorization: `Bearer ${token}`,
      },
      body: body_content,
    });

    const data = await response.json();

    if (data.object === "error") {
      res.status(data.status).json({ error: data.message });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error or failed to fetch data." });
  }
}

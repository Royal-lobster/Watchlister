export default async function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.database_id) {
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${req.body.database_id}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Notion-Version": "2021-08-16",
          Authorization: `Bearer ${req.body.token}`,
        },
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Server error or failed to fetch data." });
    }
  } else {
    res.status(400).json({ error: "Invalid request or missing parameters." });
  }
}

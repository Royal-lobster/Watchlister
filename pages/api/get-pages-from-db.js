export default function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.database_id) {
    fetch(`https://api.notion.com/v1/databases/${req.body.database_id}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2021-08-16",
        Authorization: `Bearer ${req.body.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data);
      });
  }
}

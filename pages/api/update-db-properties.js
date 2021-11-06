export default function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.database_id && req.body.body_content) {
    fetch(`https://api.notion.com/v1/databases/${req.body.database_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2021-08-16",
        Authorization: `Bearer ${req.body.token}`,
      },
      body: JSON.stringify(req.body.body_content),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        res.status(200).json(data);
      });
  }
}

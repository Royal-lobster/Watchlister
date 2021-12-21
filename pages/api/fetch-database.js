export default function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.page_id) {
    fetch(`https://api.notion.com/v1/databases/${req.body.page_id}`, {
      method: "PATCH",
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

export default function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.body_content) {
    fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2021-08-16",
        Authorization: `Bearer ${req.body.token}`,
      },
      body: req.body.body_content,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        res.status(200).json(data);
      });
  }
}

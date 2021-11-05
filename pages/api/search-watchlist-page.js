export default function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.search) {
    fetch(`https://api.notion.com/v1/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.body.token}`,
        "Notion-Version": "2021-08-16",
      },
      body: JSON.stringify({
        query: req.body.search,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data);
      });
  }
}

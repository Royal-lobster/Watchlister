export default function handler(req, res) {
  if (req.method === "POST" && req.body.token && req.body.page_id && req.body.archive) {
    fetch(`https://api.notion.com/v1/pages/${req.body.page_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2021-08-16",
        Authorization: `Bearer ${req.body.token}`,
      },
      body: JSON.stringify({
        archived: req.body.archive,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        res.status(200).json(data);
      });
  }
}

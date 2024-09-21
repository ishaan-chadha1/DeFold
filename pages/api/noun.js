import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get("https://noun-api.com/beta/pfp");
    res.status(200).json(response.data); // Return the noun image and metadata
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Noun" });
  }
}

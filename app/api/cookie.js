export default async function handleUser(req, res) {
  try {
    const response = await fetch("https://example.com/api/data");
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

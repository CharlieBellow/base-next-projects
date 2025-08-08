const apiBaseUrl = "http://localhost:3001"

export async function getData() {
  const data = await fetch(`${apiBaseUrl}/posts`)

  return data.json()
}
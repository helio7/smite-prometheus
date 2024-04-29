import clientPromise from "@/lib/mongodb"

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET() {

  console.log('Connecting...');
  await clientPromise;
  console.log('Connected!');

  /* const apiKey = process.env.DATA_API_KEY;
  if (!apiKey) throw new Error('Missing DATA_API_KEY');

  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': apiKey,
    },
  });
  const data = await res.json(); */
 
  return Response.json({ data: { test: 1 } })
}

import clientPromise from "@/lib/mongodb"

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    const db = (await clientPromise).db("smite-prometheus").collection("gods");

    const gods = await db.find({}).toArray();

    const sortedHunters = gods.sort((a: any, b: any) => {
      // Alphabetically
      return a.name.localeCompare(b.name);
    }).map((god: any) => {
      return {
        codename: god.codename,
        name: god.name,
        attack_speed: god.attack_speed,
        attack_speed_per_level: god.attack_speed_per_level,
        damage: god.damage,
        damage_per_level: god.damage_per_level,
      };
    });

    return Response.json({ success: true, sortedHunters });
  } catch (e) {
    console.error(e);
    return Response.json({ success: false, sortedHunters: [] });
  }

}

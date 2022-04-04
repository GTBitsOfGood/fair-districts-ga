import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    //tentative
    await getLegislators(req, res);
  }
}

//! GET RID OF THIS
async function getLegislators(req, res) {
  // const counties = await prisma.county.findMany();
  const legislators = await prisma.legislator.findMany();
  res.status(200).json(
    // counties: counties.map((county) => ({
    //   ...county,
    //   selected: false,
    // })),
    legislators.map(({ id, firstName, lastName }) => ({
      label: `${firstName} ${lastName}`,
      value: id,
    }))
  );
}

export default handler;

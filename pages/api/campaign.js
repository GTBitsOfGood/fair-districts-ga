import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    //tentative
    await getCountiesLegislators(req, res);
  }
}

async function getCountiesLegislators(req, res) {
  const counties = await prisma.county.findMany();
  const legislators = await prisma.legislator.findMany();
  res.status(200).json({
    counties: counties.map((county) => ({
      ...county,
      selected: false,
    })),
    legislators: legislators.map((legislator) => ({
      ...legislator,
      selected: false,
    })),
  });
}

export default handler;

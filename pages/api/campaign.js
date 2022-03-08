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
    counties: counties.reduce(
      (prev, cur) => ({
        ...prev,
        [cur["name"]]: false,
      }),
      {}
    ),
    legislators: legislators.reduce(
      (prev, cur) => ({
        ...prev,
        [cur["id"]]: {
          firstName: cur.firstName,
          lastName: cur.lastName,
          selected: false,
        },
      }),
      {}
    ),
  });
}

export default handler;

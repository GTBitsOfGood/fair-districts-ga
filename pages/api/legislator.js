import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    getLegislators(req, res);
  } else if (req.method === "POST") {
    addLegislator(req, res);
  }
}

async function getLegislators(req, res) {
  const legislators = await prisma.legislator.findMany({
    include: {
      counties: true,
    },
  });
  res.status(200).json(legislators);
}

async function addLegislator(req, res) {
  const { counties, ...formData } = req.body;
  try {
    const legislator = await prisma.legislator.create({
      data: {
        ...formData,
        counties: {
          connectOrCreate: counties.map((county) => ({
            where: {
              name: county,
            },
            create: {
              name: county,
            },
            // volunteers: [],
            // legislators: [],
          })),
        },
      },
      include: {
        counties: true,
      },
    });
    res.status(200).json({
      ...legislator,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

export default handler;

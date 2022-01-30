import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    getNewspapers(req, res);
  } else if (req.method === "POST") {
    if (req.body.id) {
      getNewspaper(req, res);
    } else {
      addNewspaper(req, res);
    }
  }
}

async function getNewspapers(req, res) {
  const allNewspapers = await prisma.newspaper.findMany({
    include: {
      counties: true,
    },
  });
  // await prisma.newspaper.deleteMany();
  res.status(200).json(allNewspapers);
}

async function getNewspaper(req, res) {
  const newspaper = await prisma.newspaper.findUnique({
    where: {
      id: req.body.id,
    },
    include: {
      counties: true,
    },
  });
  newspaper.counties = newspaper.counties.map((county) => county.name);
  console.log(newspaper);
  res.status(200).json(newspaper);
}

async function addNewspaper(req, res) {
  const { counties, ...formData } = req.body;
  try {
    const newspaper = await prisma.newspaper.create({
      data: {
        ...formData,
        assignments: {
          create: [],
        },
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
      ...newspaper,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

export default handler;

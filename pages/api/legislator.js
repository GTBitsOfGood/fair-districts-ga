import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    getLegislators(req, res);
  } else if (req.method === "POST") {
    if (req.body.type === "add") {
      addLegislator(req, res);
    } else if (req.body.type === "edit") {
      editLegislator(req, res);
    } else if (req.body.type === "delete") {
      deleteLegislator(req, res);
    }
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
  const { counties, ...formData } = req.body.formData;
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

async function editLegislator(req, res) {
  const { id, formData, original } = req.body;
  const { counties } = formData;
  const removedCounties = original.counties.filter((x) => !counties.includes(x));

  try {
    const legislator = await prisma.legislator.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
        counties: {
          disconnect: removedCounties.map((c) => ({ name: c })),
          connectOrCreate: counties.map((county) => ({
            where: {
              name: county,
            },
            create: {
              name: county,
            },
          })),
        },
      },
      include: {
        counties: true,
      },
    });
    res.status(200).json(legislator);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function deleteLegislator(req, res) {
  const { id } = req.body;
  try {
    const deletedLegislator = await prisma.legislator.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(deletedLegislator);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

export default handler;

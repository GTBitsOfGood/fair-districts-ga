import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    await getLegislators(req, res);
  } else if (req.method === "POST") {
    if (req.body.type === "add") {
      await addLegislator(req, res);
    } else if (req.body.type === "edit") {
      await editLegislator(req, res);
    } else if (req.body.type === "delete") {
      await deleteLegislator(req, res);
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
          connect: counties.map((county) => ({
            name: county,
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

  const originalCounties = original.counties.map((c) => c.name);
  const removedCounties = originalCounties.filter((x) => !counties.includes(x));

  try {
    const legislator = await prisma.legislator.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
        counties: {
          disconnect: removedCounties.map((c) => ({ name: c })),
          connect: counties.map((county) => ({
            name: county,
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

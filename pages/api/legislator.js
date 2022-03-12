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
  const [ field, order ] = req.query.order_by?.split('.')
  const orderBy = {}
  if (field && order) {
    if (order === 'asc' || order === 'desc') {
      if (field != 'counties') orderBy[field] = order
    }
  }
  const legislators = await prisma.legislator.findMany({
    orderBy,
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

  const removedCounties = original.counties.filter(
    (x) => !counties.includes(x.name)
  );

  try {
    const legislator = await prisma.legislator.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
        counties: {
          disconnect: removedCounties.map((c) => ({ name: c.name })),
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

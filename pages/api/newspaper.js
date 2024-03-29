import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    await getNewspapers(req, res);
  } else if (req.method === "POST") {
    if (req.body.type === "add") {
      await addNewspaper(req, res);
    } else if (req.body.type === "edit") {
      await editNewspaper(req, res);
    } else if (req.body.type === "delete") {
      await deleteNewspaper(req, res);
    }
  }
}

async function getNewspapers(req, res) {
  if (Object.keys(req.query).length > 0) {
      const [field, order] = req.query.order_by?.split(".");
      const orderBy = {};
      if (field && order) {
        if (order === "asc" || order === "desc") {
          if (field != "counties") orderBy[field] = order;
        }
      }
      const allNewspapers = await prisma.newspaper.findMany({
        orderBy,
        include: {
          counties: true,
        },
      });
      res.status(200).json(allNewspapers);
  } else {
    const allNewspapers = await prisma.newspaper.findMany({
      include: {
        counties: true,
      },
    });
    res.status(200).json(allNewspapers);
  }
}

async function addNewspaper(req, res) {
  const { counties, ...formData } = req.body.formData;
  try {
    const newspaper = await prisma.newspaper.create({
      data: {
        ...formData,
        assignments: {
          create: [],
        },
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
    res.status(200).json(newspaper);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function editNewspaper(req, res) {
  const { id, formData, original } = req.body;
  const { counties } = formData;

  const removedCounties = original.counties.filter(
    (x) => !counties.includes(x.name)
  );

  try {
    const newspaper = await prisma.newspaper.update({
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
    res.status(200).json(newspaper);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function deleteNewspaper(req, res) {
  const { id } = req.body;
  try {
    const deletedNewspaper = await prisma.newspaper.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(deletedNewspaper);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

export default handler;

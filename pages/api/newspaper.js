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
  const allNewspapers = await prisma.newspaper.findMany({
    include: {
      counties: true,
    },
  });
  res.status(200).json(allNewspapers);
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

  const originalCounties = original.counties.map((c) => c.name);
  const removedCounties = originalCounties.filter((x) => !counties.includes(x));

  try {
    const newspaper = await prisma.newspaper.update({
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

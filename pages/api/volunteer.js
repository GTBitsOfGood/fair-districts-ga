import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    getVolunteers(req, res);
  } else if (req.method === "POST") {
    if (req.body.type === "add") {
      await addVolunteer(req, res);
    } else if (req.body.type === "edit") {
      await editVolunteer(req, res);
    } else if (req.body.type === "delete") {
      await deleteVolunteer(req, res);
    }
  }
}

async function getVolunteers(req, res) {
  if (req.query.length > 0) {
    const [field, order] = req.query.order_by?.split(".");
    const orderBy = {};
    if (field && order) {
      if (order === "asc" || order === "desc") {
        if (field != "counties") orderBy[field] = order;
      }
    }
    const allVolunteers = await prisma.volunteer.findMany({
      orderBy,
      include: {
        assignments: true,
        county: true,
      },
    });
    res.status(200).json(allVolunteers);
  } else {
    const allVolunteers = await prisma.volunteer.findMany({
      include: {
        assignments: true,
        county: true,
      },
    });
    res.status(200).json(allVolunteers);
  }
}

async function addVolunteer(req, res) {
  const { county, ...formData } = req.body.formData;
  try {
    const vol = await prisma.volunteer.create({
      data: {
        ...formData,
        assignments: {
          create: [],
        },
        county: {
          connect: {
            name: county,
          },
        },
      },
      include: {
        assignments: true,
        county: true,
      },
    });
    res.status(200).json(vol);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function editVolunteer(req, res) {
  const {
    id,
    formData: { county, ...formData },
  } = req.body;

  try {
    const volunteer = await prisma.volunteer.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
        county: {
          connect: {
            name: county,
          },
        },
      },
      include: {
        assignments: true,
        county: true,
      },
    });
    res.status(200).json(volunteer);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function deleteVolunteer(req, res) {
  const { id } = req.body;

  try {
    const deletedVolunteer = await prisma.volunteer.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(deletedVolunteer);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

export default handler;

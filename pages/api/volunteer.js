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
  const allVolunteers = await prisma.volunteer.findMany({
    include: {
      assignments: true,
    },
  });
  res.status(200).json(allVolunteers);
}

async function addVolunteer(req, res) {
  const {county, ...formData } = req.body.formData;
  try {
    const vol = await prisma.volunteer.create({
      data: {
        ...formData,
        assignments: {
          create: [],
        },
        county: {
          connectOrCreate: ({
            where: {
              name: county,
            },
            create: {
              name: county,
            },
          }),
        },
      },
      include: {
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
  const { id, formData, original } = req.body;
  const { assignments } = formData;

  const originalAssignments = original.assignments.map((a) => a.name);
  const removedAssignments = originalAssignments.filter((x) => !assignments.includes(x));

  try {
    const volunteer = await prisma.volunteer.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
        assignments: {
          disconnect: removedAssignments.map((a) => ({ name: a })),
          connectOrCreate: assignments.map((assignment) => ({
            where: {
              name: assignment,
            },
            create: {
              name: assignment,
            },
          })),
        },
      },
      include: {
        assignments: true,
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
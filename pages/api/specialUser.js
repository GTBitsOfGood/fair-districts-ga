import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    await getSpecialUsers(req, res);
  } else if (req.method === "POST") {
    if (req.body.type === "add") {
      await addSpecialUser(req, res);
    } else if (req.body.type === "edit") {
      await editSpecialUser(req, res);
    } else if (req.body.type === "delete") {
      await deleteSpecialUser(req, res);
    }
  }
}

async function getSpecialUsers(req, res) {
  const allSpecialUsers = await prisma.specialUser.findMany();
  res.status(200).json(allSpecialUsers);
}

async function addSpecialUser(req, res) {
  const { ...formData } = req.body.formData;
  try {
    const specialUser = await prisma.specialUser.create({
      data: {
        ...formData,
      }
    });
    res.status(200).json(specialUser);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function editSpecialUser(req, res) {
  const { id, formData, original } = req.body;

  try {
    const specialUser = await prisma.specialUser.update({
      where: {
        id: id,
      },
      data: {
        ...formData,
      },
    });
    res.status(200).json(specialUser);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

async function deleteSpecialUser(req, res) {
  const { id } = req.body;
  try {
    const deletedSpecialUser = await prisma.specialUser.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(deletedSpecialUser);
  } catch (e) {
    console.log(e);
    res.status(400).json({});
  }
}

export default handler;

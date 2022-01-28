import { PrismaClient } from "@prisma/client";
import { resolveContent } from "nodemailer/lib/shared";
const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === "GET") {
    getNewspapers(req, res);
  } else if (req.method === "POST") {
    addNewspaper(req, res);
  }
}

async function getNewspapers(req, res) {
  const allNewspapers = await prisma.newspaper.findMany();
  //   await prisma.newspaper.deleteMany();
  res.status(200).json(allNewspapers);
}

async function addNewspaper(req, res) {
  const { counties, ...formData } = req.body;
  try {
    const newspaper = await prisma.newspaper.create({
      data: formData,
    });
    res.status(200).json({
      ...newspaper,
    });
  } catch {
    res.status(400).json({});
  }
}

export default handler;

import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    await getCounties(req, res);
  }
}

async function getCounties(req, res) {
  const allCounties = await prisma.county.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      volunteers: true,
      newspapers: true,
      legislators: true,
    },
  });
  res.status(200).json(allCounties);
}

export default handler;

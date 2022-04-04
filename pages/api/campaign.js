import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    await getLegislators(req, res);
  } else if (req.method === "POST") {
    if (req.query.focus === "counties") {
      await generateAssignmentsByCounties(req, res);
    } else if (req.query.focus === "legislators") {
      await generateAssignmentsByLegislators(req, res);
    }
  }
}

async function getLegislators(req, res) {
  const legislators = await prisma.legislator.findMany();
  res.status(200).json(
    legislators.map(({ id, firstName, lastName }) => ({
      label: `${firstName} ${lastName}`,
      value: id,
    }))
  );
}

async function generateAssignmentsByCounties(req, res) {
  const {
    focus: { counties },
  } = req.body;
  res.status(200).json(await generateAssignments(counties));
}

async function generateAssignmentsByLegislators(req, res) {
  const {
    focus: { legislators },
  } = req.body;
  const counties = await prisma.county.findMany({
    where: {
      legislators: {
        some: {
          id: {
            in: legislators,
          },
        },
      },
    },
  });
  res.status(200).json(await generateAssignments(counties));
}

async function generateAssignments(counties) {
  const newspapersInCounties = await prisma.newspaper.findMany({
    where: {
      counties: {
        some: {
          name: {
            in: counties,
          },
        },
      },
    },
    orderBy: {
      rating: "desc",
    },
    select: {
      name: true,
      rating: true,
    },
  });

  // Prioritizes volunteers with least assignments IN counties
  const volunteersInCounties = await prisma.volunteer.findMany({
    where: {
      county: {
        name: {
          in: counties,
        },
      },
    },
    orderBy: {
      assignments: {
        _count: "asc",
      },
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  });

  let volunteers = volunteersInCounties;

  if (volunteersInCounties.length < newspapersInCounties.length) {
    // Prioritizes volunteers with least assignments OUT of counties
    const volunteersOutCounties = await prisma.volunteer.findMany({
      where: {
        county: {
          name: {
            notIn: counties,
          },
        },
      },
      orderBy: {
        assignments: {
          _count: "asc",
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
      take: newspaperInCounties.length - volunteersInCounties.length,
    });
    volunteers = volunteers.concat(volunteersOutCounties);
  }

  const assigned = newspapersInCounties.map((newspaper, i) => ({
    ...newspaper,
    ...volunteers[i],
  }));

  return assigned;
}

export default handler;

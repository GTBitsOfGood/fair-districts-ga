import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    await getLegislators(req, res);
  } else if (req.method === "POST") {
    if (req.query.focus === "counties") {
      await generateAssignmentsByCounties(req, res);
    } else if (req.query.focus === "legislators") {
      await generateAssignmentsByLegislators(req, res);
    } else {
      await addCampaign(req, res);
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

  // 2 API requests: Volunteers IN counties, volunteers OUT of counties
  // alternatively - could query all volunteers and then sort by whether they are in counties or not

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
      county: {
        select: {
          name: true,
        },
      },
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
        county: {
          select: {
            name: true,
          },
        },
      },
      // take: newspapersInCounties.length - volunteersInCounties.length,
    });
    volunteers = volunteers.concat(volunteersOutCounties);
  }

  let assigned = [];
  for (
    let i = 0;
    i < Math.min(newspapersInCounties.length, volunteers.length);
    i++
  ) {
    const { name: newspaperName, rating: newspaperRating } =
      newspapersInCounties[i];
    const {
      first_name: volFirstName,
      last_name: volLastName,
      id: volId,
      county: { name: county },
    } = volunteers[i];
    assigned.push({
      newspaper: {
        label: newspaperName,
        value: newspaperName,
        rating: newspaperRating,
      },
      volunteer: {
        label: `${volFirstName} ${volLastName}`,
        value: volId,
        county,
      },
    });
  }

  return {
    newspapersInCounties: newspapersInCounties.map(({ name, rating }) => ({
      label: name,
      value: name,
      rating,
    })),
    initialAssignments: assigned,
    volunteers: volunteers.map((volunteer) => ({
      label: `${volunteer.first_name} ${volunteer.last_name}`,
      value: volunteer.id,
      county: volunteer.county.name,
    })),
  };
}

async function addCampaign(req, res) {
  const { assignments } = req.body;
}

export default handler;

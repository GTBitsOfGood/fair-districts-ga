import prisma from "../../prisma/prisma";

async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.id) {
      await getCampaignById(req, res);
    } else {
      await getCampaigns(req, res);
    }
  } else if (req.method === "POST") {
    if (req.query.focus === "counties") {
      await generateAssignmentsByCounties(req, res);
    } else if (req.query.focus === "legislators") {
      await generateAssignmentsByLegislators(req, res);
    } else {
      await addCampaign(req, res);
    }
  } else if (req.method === "DELETE") {
    await deleteCampaign(req, res);
  }
}

async function getCampaigns(req, res) {
  const campaigns = await prisma.campaign.findMany({});
  res.status(200).json(campaigns);
}

async function getCampaignById(req, res) {
  const { id } = req.query;
  const campaign = await prisma.campaign.findUnique({
    where: {
      id,
    },
    include: {
      assignments: {
        select: {
          volunteer: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
            },
          },
          newspaper: {
            select: {
              name: true,
              email: true,
              submissionURL: true,
            },
          },
          emailSent: true,
          id: true 
        },
      },
    },
  });
  res.status(200).json(campaign);
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
    select: {
      name: true,
    },
  });
  res
    .status(200)
    .json(await generateAssignments(counties.map(({ name }) => name)));
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
      id: true,
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
    const {
      id: newspaperId,
      name: newspaperName,
      rating: newspaperRating,
    } = newspapersInCounties[i];
    const {
      first_name: volFirstName,
      last_name: volLastName,
      id: volId,
      county: { name: county },
    } = volunteers[i];
    assigned.push({
      newspaper: {
        label: newspaperName,
        value: newspaperId,
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
    newspapersInCounties: newspapersInCounties.map(({ id, name, rating }) => ({
      label: name,
      value: id,
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

const removeDuplicateAssignments = (assignments) => {
  return assignments.filter(
    (assignment, i, self) =>
      i ===
      self.findIndex(
        ({ newspaper, volunteer }) =>
          assignment.newspaper.value === newspaper.value &&
          assignment.volunteer.value === volunteer.value
      )
  );
};

async function addCampaign(req, res) {
  const { campaignForm, assignments } = req.body;
  const { name, description, startDate } = campaignForm;

  const campaign = await prisma.campaign.create({
    data: {
      name,
      description,
      startDate,
      assignments: {
        createMany: {
          data: removeDuplicateAssignments(assignments).map(
            ({
              newspaper: { value: newspaperId },
              volunteer: { value: volId },
            }) => ({
              volunteerId: volId,
              newspaperId,
            })
          ),
        },
      },
    },
    include: {
      assignments: true,
    },
  });
  res.status(200).json(campaign);
}

async function deleteCampaign(req, res) {
  const { id } = req.body;
  const campaign = await prisma.campaign.delete({
    where: {
      id,
    },
  });
  res.status(200).json(campaign);
}

export default handler;

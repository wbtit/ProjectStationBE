import prisma from "../lib/prisma.js";

const fetchTeamDetails = async ({ ids,id }) => {
  console.log(id)
  try {
    const tasks = await prisma.task.findMany({
      where: { project_id: id },
      include: {
        user: true,
      },
    });
    console.log(tasks.length)
    // Convert the array of users from tasks to a hashmap (avoid duplicates)
    const userMap = tasks.reduce((map, task) => {
      const user = task.user;
      if (user && !map[user.id]) {
        map[user.id] = user;
      }
      return map;
    }, {});

    return userMap;
  } catch (error) {
    console.error("Error fetching team details:", error);
    return null;
  }
};

export { fetchTeamDetails };

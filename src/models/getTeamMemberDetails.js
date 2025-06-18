
    import prisma from "../lib/prisma.js";


    const fetchTeamDetails = async ({ ids }) => {
    try {
      const users = await prisma.users.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });


      // Convert the array of users to a hashmap
      const userMap = users.reduce((map, user) => {
        map[user.id] = user;
        return map;
      }, {});


      return userMap;
    } catch (error) {
      console.error("Error fetching team details:", error);
      return null;
    }
    };


    export { fetchTeamDetails };
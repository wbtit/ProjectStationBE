import prisma from "../lib/prisma.js";

const areUsers = async ({ users }) => {
  if (users.length === 0) {
    console.log("Users are empty");
    return { foundUsers: [], missingUsers: [] };
  }

  try {
    // Extract only the IDs from the users array
    const userIds = users.map((user) => user.id);

    // Query the database to find users with matching IDs
    const usersFound = await prisma.users.findMany({
      where: {
        id: { in: userIds },
      },
    });

    console.log("Full users", usersFound);

    // Map found users to include their corresponding roles
    const foundUsers = usersFound.map((user) => {
      const correspondingUser = users.find((u) => u.id === user.id);
      return { ...user, role: correspondingUser.role };
    });

    // Identify missing users by filtering IDs not found in the database
    const foundIds = usersFound.map((user) => user.id);
    const missingUsers = users
      .filter((user) => !foundIds.includes(user.id))
      .map((user) => ({
        id: user.id,
        role: user.role,
      }));

    return { foundUsers, missingUsers };
  } catch (error) {
    console.log(error.message);
    return { foundUsers: [], missingUsers: [] };
  } finally {
    await prisma.$disconnect();
  }
};

export { areUsers };
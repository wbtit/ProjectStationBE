// Utility to get next CO number
const getNextCONumber = async () => {
  const lastCO = await prisma.changeOrder.findFirst({
    orderBy: { createdAt: "desc" },
    select: { changeOrder: true },
  });

  if (!lastCO) return "CO001";

  const lastNum = parseInt(lastCO.changeOrder.replace("CO", ""), 10);
  const nextNum = String(lastNum + 1).padStart(3, "0");
  return `CO${nextNum}`;
};
export {getNextCONumber}
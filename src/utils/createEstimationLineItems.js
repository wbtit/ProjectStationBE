import lineItems from "../../data/estimationLineItems.js";
import prisma from "../lib/prisma.js";

async function createEstimationLineItem(groupId) {
    if (!groupId) {
        console.error('❌ estimationId is not provided');
        return;
    }

    try {
        const lineItemsToInsert = lineItems.map(item => ({
            ...item,
            groupId:groupId
        }));

        const createItems = await prisma.estimationLineItem.createMany({
            data: lineItemsToInsert
        });

        console.log("✅ Line items inserted:", createItems);
        return createItems;

    } catch (error) {
        console.error("❌ Error inserting line items:", error);
        throw error;
    }
}

export default createEstimationLineItem;

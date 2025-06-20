import lineItems from "../../data/estimationLineItems.js";
import prisma from "../lib/prisma.js";


async function createEstimationLineItem(estimationId){
    if(!estimationId){
        console.error('estimationId is not provided')
    }
    try {
    const lineItemsToInsert= lineItems.map(item=>({
        ...item &&
        estimationId
    }))
    const createItems= await prisma.EstimationLineItem.createMany({
        data:lineItemsToInsert,
        EstimationLineItem:true
    })
     console.log("✅ Line items inserted:", createItems);
    return createItems;

} catch (error) {
    console.error("❌ Error inserting line items:", error);
    throw error;   
}
}
export default createEstimationLineItem;
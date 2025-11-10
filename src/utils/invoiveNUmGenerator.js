import prisma from "../lib/prisma.js";


async function invoiveNumberGenerator() {
const previosInvoice = await prisma.invoice.findFirst({
  orderBy: {
    createdAt: 'desc',
  },
});
const currentYear = new Date().getFullYear();

if (previosInvoice) {
  const prevInvoiceNumber = previosInvoice.invoiceNumber; // Assuming invoiceNumber is a string like "WBLLC/2023/001"
  const parts = prevInvoiceNumber.split('/');

  if (parts.length === 3) {
    const year = parts[1];
    let sequenceNumber = parseInt(parts[2], 10);

    if (year === currentYear.toString()) {
      sequenceNumber += 1; // Increment sequence number for the same year
    } else {
      sequenceNumber = 1; // Reset sequence number for a new year
    }

    const formattedSequence = String(sequenceNumber).padStart(3, '0');
    return `WBLLC/${currentYear}/${formattedSequence}`;
  } else {
    // Handle unexpected format
    throw new Error('Unexpected invoice number format');
  }
}
return `WBLLC/${currentYear}/001`; // First invoice of the year
}

export default invoiveNumberGenerator;
import prisma from "../lib/prisma.js";


async function invoiceNumberGenerator() {
  const currentYear = new Date().getFullYear();
  const prefix = `WBLLC/${currentYear}/`;
  
  const previousInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: 'WBLLC/',
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  if (previousInvoice && previousInvoice.invoiceNumber) {
    const prevInvoiceNumber = previousInvoice.invoiceNumber; // e.g., "WBLLC/2023/001"
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
    }
  }
  
  // Fallback if the last invoice had an unexpected format,
  // or if there are no invoices with the prefix yet.
  // This will now correctly generate the first invoice of the year.
  return `WBLLC/${currentYear}/001`;
}

export default invoiceNumberGenerator;
import express from "express";
import * as invoiceController from "../../controllers/invoice.js";
import * as itemController from "../../controllers/invoiceItems.js"
import * as accountController from "../../controllers/accountInfo.js"
import Authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

// 🧾 Invoice
router.post("/",Authenticate, invoiceController.createInvoice);
router.get("/",Authenticate, invoiceController.getAllInvoices);
router.get("/:id",Authenticate, invoiceController.getInvoiceById);
router.put("/:id",Authenticate, invoiceController.updateInvoice);
router.delete("/:id",Authenticate, invoiceController.deleteInvoice);

// 🧮 Invoice Items
router.post("/:id/items",Authenticate, itemController.addInvoiceItem);
router.put("/:invoiceId/items/:itemId",Authenticate, itemController.updateInvoiceItem);
router.delete("/:invoiceId/items/:itemId",Authenticate, itemController.deleteInvoiceItem);

// 🏦 Account Info
router.post("/accountInfo",Authenticate, accountController.addAccountInfo);
router.put("/:id/account",Authenticate, accountController.updateAccountInfo);
router.get("/account/:id/account",Authenticate, accountController.getAccountInfo);
router.get("/accounts/all",Authenticate,accountController.getAllAccountInfo)
router.delete("/account/:id",Authenticate,accountController.deleteAccountInfo)
export { router as Invoice };
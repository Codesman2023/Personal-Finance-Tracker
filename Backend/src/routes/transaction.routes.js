const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  exportTransactions,
  sendMonthlyReport,
} = require("../controllers/transaction.controller");

router.post("/", authMiddleware.authUser, createTransaction);
router.get("/", authMiddleware.authUser, getTransactions);
router.post("/monthly-report", authMiddleware.authUser, sendMonthlyReport);
router.put("/:id", authMiddleware.authUser, updateTransaction);
router.delete("/:id", authMiddleware.authUser, deleteTransaction);
router.get("/export", authMiddleware.authUser, exportTransactions);

module.exports = router;

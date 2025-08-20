const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

router.post("/", authMiddleware.authUser, createTransaction);
router.get("/", authMiddleware.authUser, getTransactions);
router.put("/:id", authMiddleware.authUser, updateTransaction);
router.delete("/:id", authMiddleware.authUser, deleteTransaction);

module.exports = router;

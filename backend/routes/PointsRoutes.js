import express from 'express';
import {
  addPoints,
  getAllPoints,
  redeemPoints,
  updatePoints,
  getPointsByUserId,
  deleteRedeemedPoints,  // <-- Added deleteRedeemedPoints import
} from '../controllers/PointsController.js';

const router = express.Router();

router.post('/add', addPoints);
router.get('/all', getAllPoints);
router.get('/:userId', getPointsByUserId); // ← This is used by frontend when opening edit
router.put('/update/:userId', updatePoints); // ← Used when updating via modal
router.put('/redeem/:userId', redeemPoints);
router.delete('/delete/:userId', deleteRedeemedPoints); // <-- Added the delete endpoint

export default router;
` `
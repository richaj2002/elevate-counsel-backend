import express from 'express';
import { getSlots, getSlot, addSlot, updateSlot, getCounselorSlots } from '../controllers/slotController.js';
import { validateSlot, validateSlotUpdate } from '../middleware/validators/slotValidator.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const slotRouter = express.Router();

slotRouter.get('/', authenticateJWT, authorizeRoles('admin', 'counselor'), getSlots);
slotRouter.get('/:id', authenticateJWT, authorizeRoles('admin', 'counselor'), getSlot);
slotRouter.get('counselor/:id', getCounselorSlots);
slotRouter.post('/', authenticateJWT, authorizeRoles('counselor'), validateSlot, addSlot);
slotRouter.patch('/:id', authenticateJWT, authorizeRoles('counselor'), validateSlotUpdate, updateSlot);

export default slotRouter;

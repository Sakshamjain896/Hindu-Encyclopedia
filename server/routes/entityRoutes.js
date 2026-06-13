import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
    getEntities, 
    getEntityById, 
    createEntity, 
    updateEntity, 
    deleteEntity 
} from '../controllers/entityController.js';

const router = express.Router();

router.route('/')
    .get(getEntities)
    .post(protect, admin, createEntity);

router.route('/:id')
    .get(getEntityById)
    .put(protect, admin, updateEntity)
    .patch(protect, admin, updateEntity)
    .delete(protect, admin, deleteEntity);

export default router;
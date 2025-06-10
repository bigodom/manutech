import { Router } from 'express';
import { createMaintenance, deleteMaintenance, getMaintenanceById, getMaintenances, updateMaintenance } from '../controllers/maintenanceController.js';
const maintenanceRoutes = Router();

maintenanceRoutes.route('/maintenance')
    .get(getMaintenances)
    .post(createMaintenance);

maintenanceRoutes.route('/maintenance/:id')
    .get(getMaintenanceById)
    .put(updateMaintenance)
    .delete(deleteMaintenance);

export default maintenanceRoutes;
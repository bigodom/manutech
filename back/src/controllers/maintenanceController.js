import prisma from "../services/databaseClient.js";

const createMaintenance = async (req, res) => {
    /* #swagger.tags = ['Maintenance']
       #swagger.description = 'Create a new maintenance record'*/
    try {
        const { 
            equipment,
            description,
            requestor,
            responsible,
            priority,
            startDate,
            status,
            location
        } = req.body;

        const maintenance = await prisma.maintenance.create({
            data: {
            equipment,
            description,
            requestor,
            responsible,
            priority: priority || 'LOW',
            startDate: startDate ? new Date(startDate) : null,
            status: typeof status === 'boolean' ? status : false,
            location,
            },
        });
        res.status(201).json(maintenance);
    } catch (error) {
        console.error("Error creating maintenance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getMaintenances = async (req, res) => {
    try {
        const maintenances = await prisma.maintenance.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(maintenances);
    } catch (error) {
        console.error("Error fetching maintenances:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getMaintenanceById = async (req, res) => {
    /* #swagger.tags = ['Maintenance']
       #swagger.description = 'Get a maintenance record by ID'*/
    const { id } = req.params;
    try {
        const maintenance = await prisma.maintenance.findUnique({
            where: { id: parseInt(id) },
        });
        if (!maintenance) {
            return res.status(404).json({ error: "Maintenance not found" });
        }
        res.status(200).json(maintenance);
    } catch (error) {
        console.error("Error fetching maintenance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateMaintenance = async (req, res) => {
    /* #swagger.tags = ['Maintenance']
       #swagger.description = 'Update a maintenance record'*/
    const { id } = req.params;
    try {
        const {
            equipment,
            description,
            requestor,
            responsible,
            priority,
            startDate,
            status,
            location
        } = req.body;

        const maintenance = await prisma.maintenance.update({
            where: { id: parseInt(id) },
            data: {
                equipment,
                description,
                requestor,
                responsible,
                priority,
                startDate: startDate ? new Date(startDate) : undefined,
                status,
                location,
                completionDate: status === true ? new Date() : null
            },
        });
        res.status(200).json(maintenance);
    } catch (error) {
        console.error("Error updating maintenance:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Maintenance not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteMaintenance = async (req, res) => {
    /* #swagger.tags = ['Maintenance']
       #swagger.description = 'Delete a maintenance record'*/
    const { id } = req.params;
    try {
        await prisma.maintenance.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting maintenance:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Maintenance not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    createMaintenance,
    getMaintenances,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
};
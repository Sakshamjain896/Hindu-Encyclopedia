import Entity from '../models/Entity.js';

// @desc    Get all entities (with optional filtering)
// @route   GET /api/entities
// @access  Public
export const getEntities = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const entities = await Entity.find(query);
        res.json(entities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single entity by ID
// @route   GET /api/entities/:id
// @access  Public
export const getEntityById = async (req, res) => {
    try {
        const entity = await Entity.findById(req.params.id);
        if (entity) res.json(entity);
        else res.status(404).json({ message: 'Entity not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an entity
// @route   POST /api/entities
// @access  Private/Admin
export const createEntity = async (req, res) => {
    try {
        const entity = await Entity.create(req.body);
        res.status(201).json(entity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an entity
// @route   PUT /api/entities/:id
// @access  Private/Admin
export const updateEntity = async (req, res) => {
    try {
        const entity = await Entity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (entity) res.json(entity);
        else res.status(404).json({ message: 'Entity not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an entity
// @route   DELETE /api/entities/:id
// @access  Private/Admin
export const deleteEntity = async (req, res) => {
    try {
        const entity = await Entity.findByIdAndDelete(req.params.id);
        if (entity) res.json({ message: 'Entity removed' });
        else res.status(404).json({ message: 'Entity not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
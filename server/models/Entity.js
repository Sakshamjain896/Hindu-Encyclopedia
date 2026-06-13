import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        category: {
            type: String,
            required: true,
            enum: ['God', 'Asura', 'Avatar', 'Yaksha', 'Gandharva', 'Other'],
            default: 'God',
        },
        titles: [{ type: String }],
        description: { type: String, required: true },
        lore: { type: String },
        imagePath: { type: String },
    },
    { timestamps: true }
);

const Entity = mongoose.model('Entity', entitySchema);
export default Entity;
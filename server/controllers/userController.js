import User from '../models/User.js';

// @desc    Get user profile w/ saved shrines
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedShrine', 'name category imagePath');
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                savedShrine: user.savedShrine,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add/Remove entity from savedShrine
// @route   POST /api/users/bookmark/:entityId
// @access  Private
export const toggleBookmark = async (req, res) => {
    if (!req.params.entityId) return res.status(400).json({ message: 'No entity ID provided' });
    
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const alreadySaved = user.savedShrine.includes(req.params.entityId);

        if (alreadySaved) {
            user.savedShrine = user.savedShrine.filter(
                (id) => id.toString() !== req.params.entityId
            );
        } else {
            user.savedShrine.push(req.params.entityId);
        }

        await user.save();
        res.json({ message: alreadySaved ? 'Bookmark removed' : 'Bookmark added', savedShrine: user.savedShrine });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
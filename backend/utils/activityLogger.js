const ActivityLog = require('../models/ActivityLog');

exports.logActivity = async (restaurantId, action, description, userOrId = null) => {
    try {
        if (!restaurantId) return;

        let staffName = 'System';
        let staffEmail = 'system@dinespot.com';
        let userId = null;
        let staffId = null;

        if (userOrId) {
            if (typeof userOrId === 'object' && userOrId !== null) {
                staffName = userOrId.name || 'Staff';
                staffEmail = userOrId.email || 'staff@dinespot.com';
                if (userOrId.role === 'staff') {
                    staffId = userOrId._id || userOrId.id;
                } else {
                    userId = userOrId._id || userOrId.id;
                }
            } else {
                userId = userOrId;
                staffName = 'User Action';
                staffEmail = 'user@dinespot.com';
            }
        }

        await ActivityLog.create({
            restaurantId,
            action,
            description,
            userId,
            staffId,
            staffName,
            staffEmail
        });
        console.log(`Activity Logger: Recorded [${action}] by ${staffEmail} for Restaurant: ${restaurantId}`);
    } catch (err) {
        console.error('Activity Logger Error:', err.message);
    }
};

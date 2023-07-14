const UserSchema = require('../db/Schemas/User.js');

module.exports = {
    checkKeys: async () => {
        const users = await UserSchema.find();
        users.forEach(async (user) => {
            const date = new Date
            const dateCheck = date.getTime()
            if (user.hasAccess) {
                if (dateCheck >= user.accessDate) {
                    user.accessDate = "noAccess"
                    user.hasAccess = false
                    user.save()
                }
            }
        });
    }
}
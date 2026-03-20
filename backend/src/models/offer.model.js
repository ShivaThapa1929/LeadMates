const { db } = require('../config/db');

const Offer = {
    tableName: 'offers',

    findAll: async () => {
        return await db(Offer.tableName)
            .where({ is_deleted: false })
            .orderBy('created_at', 'desc');
    },

    findUserOffers: async (userId) => {
        return await db(Offer.tableName)
            .where({ user_id: userId, is_deleted: false })
            .orderBy('created_at', 'desc');
    },

    findById: async (id) => {
        return await db(Offer.tableName).where({ id, is_deleted: false }).first();
    },

    create: async (offerData) => {
        const [id] = await db(Offer.tableName).insert(offerData);
        return await Offer.findById(id);
    },
};

module.exports = Offer;

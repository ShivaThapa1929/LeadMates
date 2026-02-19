
exports.up = function (knex) {
    return knex.schema.table('roles', function (table) {
        table.json('permissions'); // Stores module-based permissions
        table.string('status').defaultTo('active'); // active, inactive
    });
};

exports.down = function (knex) {
    return knex.schema.table('roles', function (table) {
        table.dropColumn('permissions');
        table.dropColumn('status');
    });
};

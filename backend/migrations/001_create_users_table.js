exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('phone', 20);
    table.enum('user_type', [
      'fund_provider',
      'coordinating_agency',
      'pfi',
      'insurance',
      'pmt',
      'anchor',
      'lead_firm',
      'farmer',
      'cooperative_group',
      'derisking_institution',
      'extension_organization',
      'researcher_student',
      'admin'
    ]).notNullable();
    table.string('organization_name', 255);
    table.string('organization_id', 100);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('email_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
    table.string('reset_password_token', 255).nullable();
    table.timestamp('reset_password_expires').nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['user_type']);
    table.index(['organization_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};

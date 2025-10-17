exports.up = function(knex) {
  return knex.schema.createTable('stakeholders', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.enum('stakeholder_type', [
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
      'researcher_student'
    ]).notNullable();
    
    // Organization details
    table.string('organization_name', 255);
    table.string('registration_number', 100);
    table.string('tax_id', 100);
    table.enum('legal_status', ['individual', 'corporation', 'partnership', 'cooperative', 'ngo']).nullable();
    table.string('business_field', 255);
    
    // Contact information
    table.text('registered_address');
    table.string('city', 100);
    table.string('state', 100);
    table.string('postal_code', 20);
    table.string('website', 255);
    table.integer('staff_strength').nullable();
    
    // Contact person details
    table.string('contact_person_name', 255);
    table.string('contact_person_title', 100);
    table.string('contact_person_email', 255);
    table.string('contact_person_designation', 100);
    table.string('contact_person_phone', 20);
    
    // Status and verification
    table.enum('verification_status', ['pending', 'verified', 'rejected']).defaultTo('pending');
    table.text('verification_notes').nullable();
    table.integer('verified_by').unsigned().references('id').inTable('users').nullable();
    table.timestamp('verified_at').nullable();
    
    // Portal access
    table.enum('portal_access', ['portal_a', 'portal_b', 'portal_c', 'portal_d']).nullable();
    table.json('permissions').nullable();
    
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['stakeholder_type']);
    table.index(['verification_status']);
    table.index(['portal_access']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stakeholders');
};

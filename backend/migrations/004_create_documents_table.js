exports.up = function(knex) {
  return knex.schema.createTable('documents', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    
    // File information
    table.string('filename', 255).notNullable();
    table.string('original_name', 255).notNullable();
    table.string('file_path', 500).notNullable();
    table.bigInteger('file_size').notNullable();
    table.string('mime_type', 100).notNullable();
    
    // Document classification
    table.enum('document_type', [
      'identification',
      'business_registration',
      'tax_certificate',
      'financial_statement',
      'bank_statement',
      'collateral_document',
      'insurance_certificate',
      'loan_application',
      'loan_agreement',
      'repayment_schedule',
      'farm_registration',
      'anchor_agreement',
      'produce_certificate',
      'other'
    ]).notNullable();
    
    // Description and metadata
    table.text('description').nullable();
    table.json('metadata').nullable();
    
    // Related entity information
    table.enum('related_entity_type', [
      'loan',
      'stakeholder',
      'user',
      'transaction',
      'other'
    ]).nullable();
    table.integer('related_entity_id').nullable();
    
    // Status and verification
    table.enum('status', ['active', 'archived', 'deleted']).defaultTo('active');
    table.boolean('is_verified').defaultTo(false);
    table.integer('verified_by').unsigned().references('id').inTable('users').nullable();
    table.timestamp('verified_at').nullable();
    table.text('verification_notes').nullable();
    
    // Access control
    table.enum('access_level', ['private', 'restricted', 'public']).defaultTo('private');
    table.json('permissions').nullable();
    
    // Upload tracking
    table.timestamp('upload_date').defaultTo(knex.fn.now());
    table.string('upload_ip', 45).nullable();
    table.string('checksum', 64).nullable(); // For file integrity
    
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['document_type']);
    table.index(['related_entity_type', 'related_entity_id']);
    table.index(['status']);
    table.index(['upload_date']);
    table.index(['checksum']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('documents');
};

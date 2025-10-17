exports.up = function(knex) {
  return knex.schema.createTable('loans', function(table) {
    table.increments('id').primary();
    table.string('loan_reference', 100).notNullable().unique();
    table.integer('borrower_id').unsigned().references('id').inTable('stakeholders').onDelete('CASCADE');
    table.integer('lender_id').unsigned().references('id').inTable('stakeholders').onDelete('CASCADE');
    table.integer('coordinating_agency_id').unsigned().references('id').inTable('stakeholders').onDelete('CASCADE');
    
    // Loan details
    table.decimal('principal_amount', 15, 2).notNullable();
    table.decimal('interest_rate', 5, 2).notNullable();
    table.enum('interest_type', ['fixed', 'variable']).defaultTo('fixed');
    table.integer('tenor_months').notNullable();
    table.decimal('monthly_payment', 15, 2).nullable();
    table.decimal('total_amount', 15, 2).nullable();
    
    // Loan purpose
    table.enum('loan_purpose', [
      'crop_production',
      'livestock',
      'machinery_purchase',
      'input_purchase',
      'infrastructure',
      'working_capital',
      'other'
    ]).notNullable();
    table.text('purpose_description').nullable();
    
    // Status and workflow
    table.enum('status', [
      'draft',
      'submitted',
      'under_review',
      'approved',
      'disbursed',
      'active',
      'completed',
      'defaulted',
      'cancelled'
    ]).defaultTo('draft');
    
    // Dates
    table.timestamp('application_date').defaultTo(knex.fn.now());
    table.timestamp('approval_date').nullable();
    table.timestamp('disbursement_date').nullable();
    table.timestamp('maturity_date').nullable();
    table.timestamp('first_payment_date').nullable();
    
    // Insurance and risk management
    table.boolean('has_insurance').defaultTo(false);
    table.decimal('insurance_premium', 15, 2).nullable();
    table.integer('insurance_provider_id').unsigned().references('id').inTable('stakeholders').nullable();
    
    // De-risking
    table.boolean('has_derisking').defaultTo(false);
    table.decimal('derisking_amount', 15, 2).nullable();
    table.integer('derisking_provider_id').unsigned().references('id').inTable('stakeholders').nullable();
    
    // Collateral
    table.text('collateral_description').nullable();
    table.decimal('collateral_value', 15, 2).nullable();
    
    // Repayment tracking
    table.decimal('paid_amount', 15, 2).defaultTo(0);
    table.decimal('outstanding_balance', 15, 2).nullable();
    table.integer('payments_made').defaultTo(0);
    table.integer('payments_due').nullable();
    
    // Approval workflow
    table.integer('approved_by').unsigned().references('id').inTable('users').nullable();
    table.text('approval_notes').nullable();
    table.text('rejection_reason').nullable();
    
    table.timestamps(true, true);
    
    table.index(['loan_reference']);
    table.index(['borrower_id']);
    table.index(['lender_id']);
    table.index(['status']);
    table.index(['application_date']);
    table.index(['maturity_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('loans');
};

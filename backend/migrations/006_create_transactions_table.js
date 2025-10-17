exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.increments('id').primary();
    table.string('transaction_reference', 100).notNullable().unique();
    table.integer('loan_id').unsigned().references('id').inTable('loans').onDelete('CASCADE');
    
    // Transaction details
    table.enum('transaction_type', [
      'disbursement',
      'repayment',
      'interest_payment',
      'penalty_payment',
      'insurance_premium',
      'derisking_payment',
      'fee_payment',
      'refund',
      'adjustment'
    ]).notNullable();
    
    table.decimal('amount', 15, 2).notNullable();
    table.decimal('balance_before', 15, 2).notNullable();
    table.decimal('balance_after', 15, 2).notNullable();
    table.string('currency', 3).defaultTo('NGN');
    
    // Parties involved
    table.integer('payer_id').unsigned().references('id').inTable('stakeholders').nullable();
    table.integer('payee_id').unsigned().references('id').inTable('stakeholders').nullable();
    table.integer('processed_by').unsigned().references('id').inTable('users').nullable();
    
    // Transaction status
    table.enum('status', [
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'reversed'
    ]).defaultTo('pending');
    
    // Payment method and details
    table.enum('payment_method', [
      'bank_transfer',
      'cash',
      'cheque',
      'mobile_money',
      'card',
      'other'
    ]).nullable();
    
    table.string('payment_reference', 255).nullable();
    table.string('external_reference', 255).nullable();
    table.text('payment_details').nullable();
    
    // Dates
    table.timestamp('transaction_date').defaultTo(knex.fn.now());
    table.timestamp('processed_at').nullable();
    table.timestamp('settlement_date').nullable();
    
    // Additional information
    table.text('description').nullable();
    table.text('notes').nullable();
    table.text('failure_reason').nullable();
    
    // Audit and reconciliation
    table.string('reconciled_by', 100).nullable();
    table.timestamp('reconciled_at').nullable();
    table.boolean('is_reconciled').defaultTo(false);
    
    // Fees and charges
    table.decimal('processing_fee', 15, 2).defaultTo(0);
    table.decimal('transaction_fee', 15, 2).defaultTo(0);
    table.decimal('total_fees', 15, 2).defaultTo(0);
    
    table.timestamps(true, true);
    
    table.index(['loan_id']);
    table.index(['transaction_reference']);
    table.index(['transaction_type']);
    table.index(['status']);
    table.index(['transaction_date']);
    table.index(['payer_id']);
    table.index(['payee_id']);
    table.index(['payment_method']);
    table.index(['is_reconciled']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};

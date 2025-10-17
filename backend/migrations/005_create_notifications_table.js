exports.up = function(knex) {
  return knex.schema.createTable('notifications', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    
    // Notification content
    table.string('title', 255).notNullable();
    table.text('message').notNullable();
    
    // Classification
    table.enum('type', ['info', 'warning', 'error', 'success']).defaultTo('info');
    table.enum('priority', ['low', 'medium', 'high', 'urgent']).defaultTo('medium');
    
    // Action and metadata
    table.string('action_url', 500).nullable();
    table.json('metadata').nullable();
    
    // Status tracking
    table.boolean('is_read').defaultTo(false);
    table.timestamp('read_at').nullable();
    table.boolean('is_dismissed').defaultTo(false);
    table.timestamp('dismissed_at').nullable();
    
    // Delivery tracking
    table.enum('delivery_status', ['pending', 'sent', 'delivered', 'failed']).defaultTo('pending');
    table.timestamp('sent_at').nullable();
    table.timestamp('delivered_at').nullable();
    table.text('delivery_error').nullable();
    
    // Expiration
    table.timestamp('expires_at').nullable();
    table.boolean('is_expired').defaultTo(false);
    
    // Audit trail
    table.integer('created_by').unsigned().references('id').inTable('users').nullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['is_read']);
    table.index(['type']);
    table.index(['priority']);
    table.index(['created_at']);
    table.index(['expires_at']);
    table.index(['delivery_status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
};

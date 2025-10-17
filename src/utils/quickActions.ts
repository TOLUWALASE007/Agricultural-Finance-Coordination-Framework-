// Utility functions for quick actions across portals
// These will later be replaced with actual API calls

export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Console log for debugging
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Create a visible notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
    type === 'success' ? 'bg-green-600 text-white' :
    type === 'error' ? 'bg-red-600 text-white' :
    'bg-blue-600 text-white'
  }`;
  notification.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 4000);
  
  // Also show alert as fallback
  alert(`${type.toUpperCase()}: ${message}`);
};

export const generateReport = (reportType: string, format: string = 'PDF') => {
  showNotification(`Generating ${reportType} report in ${format} format... This will be available for download shortly.`, 'info');
  // Later: API call to generate report
};

export const addNewRecord = (recordType: string) => {
  showNotification(`Opening form to add new ${recordType}. This will be replaced with a modal form.`, 'info');
  // Later: Open modal form
};

export const processAction = (actionType: string, data?: any) => {
  showNotification(`Processing ${actionType}... This will be replaced with actual API calls.`, 'info');
  // Later: API call to process action
};

export const scheduleAction = (actionType: string, date?: string) => {
  showNotification(`Scheduling ${actionType}${date ? ` for ${date}` : ''}... This will be replaced with calendar integration.`, 'info');
  // Later: Calendar integration
};

export const exportData = (dataType: string, format: string = 'Excel') => {
  showNotification(`Exporting ${dataType} data in ${format} format... This will be available for download shortly.`, 'info');
  // Later: API call to export data
};

export const sendNotification = (recipients: string[], message: string) => {
  showNotification(`Sending notification to ${recipients.length} recipients... This will be replaced with actual notification system.`, 'info');
  // Later: API call to send notifications
};

export const approveAction = (actionType: string, id: string) => {
  showNotification(`Approving ${actionType} (ID: ${id})... This will be replaced with actual approval workflow.`, 'success');
  // Later: API call to approve
};

export const rejectAction = (actionType: string, id: string) => {
  showNotification(`Rejecting ${actionType} (ID: ${id})... This will be replaced with actual rejection workflow.`, 'error');
  // Later: API call to reject
};

export const viewDetails = (itemType: string, id: string) => {
  showNotification(`Opening details for ${itemType} (ID: ${id})... This will be replaced with detailed view modal.`, 'info');
  // Later: Open detailed view modal
};

export const contactPerson = (name: string, phone: string, email: string) => {
  const contactInfo = `Contact: ${name}\nPhone: ${phone}\nEmail: ${email}`;
  showNotification(`Contact information:\n${contactInfo}`, 'info');
  // Later: Open contact modal or initiate call/email
};

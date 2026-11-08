'use strict';
document.getElementById('kitInterest')?.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('aipayer:event',{detail:'kit_feedback_clicked'})));

document.getElementById('kitInvoice')?.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('aipayer:event',{detail:'kit_invoice_request_clicked'})));

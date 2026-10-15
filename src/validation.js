const SRI_LANKAN_MOBILE = /^(?:\+94|0094|0)?(7\d{8})$/;

/**
 * Normalize Sri Lankan mobile numbers to E.164.
 * Accepted examples: 0771234567, 771234567, +94771234567, 00947771234567.
 * Only Sri Lankan mobile prefixes beginning with 7 are accepted.
 */
export function normalizeSriLankanMobile(value) {
  if (typeof value !== 'string') return null;
  const compact = value.trim().replace(/[\s()-]/g, '');
  const match = compact.match(SRI_LANKAN_MOBILE);
  if (match) return `+94${match[1]}`;
  const localMatch = compact.match(/^0(7\d{8})$/);
  return localMatch ? `+94${localMatch[1]}` : null;
}

export function validateMessage(value) {
  if (typeof value !== 'string') return 'Message is required.';
  const message = value.trim();
  if (!message) return 'Message is required.';
  if (message.length > 1600) return 'Message must be 1600 characters or fewer.';
  return null;
}

export function validateSenderId(value, approvedSenderId) {
  if (typeof value !== 'string' || !value.trim()) return 'Approved sender ID is required.';
  if (!approvedSenderId) return 'APPROVED_SENDER_ID is not configured on the server.';
  if (value.trim() !== approvedSenderId.trim()) {
    return 'Sender ID must exactly match the approved sender ID configured for this SMS service.';
  }
  return null;
}

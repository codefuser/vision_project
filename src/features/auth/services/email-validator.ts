/**
 * Email validation utility to reject dummy and temporary/disposable email addresses.
 */

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getairmail.com",
  "sharklasers.com",
  "fakeinbox.com",
  "dispostable.com",
  "generator.email",
  "mohmal.com",
  "crazymailing.com",
  "mytemp.email",
  "burnermail.io",
  "dropmail.me",
  "fakemailgenerator.com",
  "inboxbear.com",
]);

export function isValidEmail(email: string): { valid: boolean; reason?: string } {
  const trimmed = email.trim().toLowerCase();

  // Basic regex check
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(trimmed)) {
    return { valid: false, reason: "Please enter a valid email address (e.g., pastor@gmail.com)." };
  }

  const domain = trimmed.split("@")[1];
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Disposable or temporary emails are not allowed. Please enter your real church or personal email.",
    };
  }

  // Reject generic placeholders
  if (
    trimmed.startsWith("test@") ||
    trimmed.startsWith("dummy@") ||
    trimmed.startsWith("admin@admin") ||
    trimmed.startsWith("asdf@") ||
    trimmed.includes("example.com") ||
    trimmed.includes("sample.com")
  ) {
    return {
      valid: false,
      reason: "Please enter your genuine church or personal email so we can verify and send updates.",
    };
  }

  return { valid: true };
}

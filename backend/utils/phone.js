export const normalizePhone = phone => {
  return String(phone || '')
    .trim()
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '')
}

export const validatePhoneE164 = phone => {
  const normalizedPhone = normalizePhone(phone)
  const e164Regex = /^\+[1-9]\d{1,14}$/

  return e164Regex.test(normalizedPhone)
}

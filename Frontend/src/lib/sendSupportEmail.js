import emailjs from "@emailjs/browser";

export const sendSupportEmail = (templateParams) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured. Add its service, template, and public key to Frontend/.env.");
  }

  return emailjs.send(serviceId, templateId, templateParams, { publicKey });
};

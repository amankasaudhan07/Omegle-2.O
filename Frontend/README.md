# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Contact and issue report email

The Contact and Report Issue forms use EmailJS. Create an EmailJS email service and a template that sends to your support inbox, then copy `Frontend/.env.example` to `Frontend/.env` and set these values:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

The shared template receives `form_type`, `name`, `email`, `reply_to`, `subject`, and `message`. Set the template's Reply-To field to `{{reply_to}}` so you can respond directly to the sender. Restart the Vite dev server after changing `.env`.

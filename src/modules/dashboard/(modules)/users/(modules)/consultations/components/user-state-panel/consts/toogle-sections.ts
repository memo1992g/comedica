import { ToggleSection } from "../interfaces/UserStatePanel.types";

export const TOGGLE_SECTIONS: ToggleSection[] = [
  {
    title: "Código de Verificación",
    description:
      "Métodos de envío para códigos de autenticación de dos factores",
    options: [
      {
        label: "Correo Electrónico",
        hint: "Enviar código por correo electrónico",
        key: "verificacion_email",
      },
      {
        label: "SMS",
        hint: "Enviar código por mensaje de texto",
        key: "verificacion_sms",
      },
    ],
  },
  {
    title: "Cambio de Contraseña",
    description: "Notificaciones cuando un usuario cambia su contraseña",
    options: [
      {
        label: "Correo Electrónico",
        hint: "Notificar por correo electrónico",
        key: "password_email",
      },
      {
        label: "SMS",
        hint: "Notificar por mensaje de texto",
        key: "password_sms",
      },
    ],
  },
  {
    title: "Vinculación de Token",
    description:
      "Confirmaciones para vincular nuevos dispositivos o tokens de seguridad",
    options: [
      {
        label: "Correo Electrónico",
        hint: "Solicitar confirmación por correo",
        key: "token_email",
      },
      {
        label: "SMS",
        hint: "Solicitar confirmación por SMS",
        key: "token_sms",
      },
    ],
  },
];

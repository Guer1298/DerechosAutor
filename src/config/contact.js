// Publicar exclusivamente datos profesionales confirmados y autorizados.
// Después de modificar esta configuración, ejecutar: npm run build.
export const contactConfig = Object.freeze({
  publicName: "",
  phoneDisplay: "+57 3122062892",
  phoneInternational: "+573122062892",
  verifiedSpecialty: "",
  officeHours: "",
  modality: "Teléfono",
  status: "verified", // "verified" cuando los datos hayan sido confirmados.
  relationship: ""
});

export function isContactAvailable(config = contactConfig) {
  return config.status === "verified" && /^\+[1-9]\d{7,14}$/.test(config.phoneInternational);
}

export const VEHICLE_DOCUMENT_CATEGORIES = [
  "RC",
  "Insurance",
  "DrivingLicense",
  "Pollution",
] as const;

export type VehicleDocumentCategory =
  typeof VEHICLE_DOCUMENT_CATEGORIES[number];
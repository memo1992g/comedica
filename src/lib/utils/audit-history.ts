export interface AuditDetailLine {
  label: string;
  oldValue?: string;
  newValue?: string;
  value?: string;
}

const OLD_VALUE_KEYS = ["old", "oldValue", "before", "previous", "anterior"];
const NEW_VALUE_KEYS = ["new", "newValue", "after", "current", "nuevo"];

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "N/A";
  }
}

function getObjectValueByKeys(
  value: Record<string, unknown>,
  keys: string[],
): unknown {
  const normalized = Object.keys(value).reduce<Record<string, unknown>>((acc, key) => {
    acc[key.toLowerCase()] = value[key];
    return acc;
  }, {});

  return keys.map((key) => normalized[key]).find((item) => item !== undefined);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseAuditDetails(details: string): AuditDetailLine[] {
  if (!details) return [{ label: "detalle", value: "N/A" }];

  try {
    const parsed: unknown = JSON.parse(details);

    if (!isRecord(parsed)) {
      return [{ label: "detalle", value: stringifyValue(parsed) }];
    }

    return Object.entries(parsed).map(([label, rawValue]) => {
      if (!isRecord(rawValue)) {
        return { label, value: stringifyValue(rawValue) };
      }

      const oldValue = getObjectValueByKeys(rawValue, OLD_VALUE_KEYS);
      const newValue = getObjectValueByKeys(rawValue, NEW_VALUE_KEYS);

      if (oldValue !== undefined || newValue !== undefined) {
        return {
          label,
          oldValue: oldValue === undefined ? "N/A" : stringifyValue(oldValue),
          newValue: newValue === undefined ? "N/A" : stringifyValue(newValue),
        };
      }

      return { label, value: stringifyValue(rawValue) };
    });
  } catch {
    return [{ label: "detalle", value: details }];
  }
}

export function formatAuditDateTime(dateInput: string): string {
  if (!dateInput) return "N/A";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return dateInput;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hour = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${day}-${month}-${year} - ${hour}:${minutes} ${period}`;
}

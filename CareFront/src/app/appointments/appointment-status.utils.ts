import { AppointmentStatusValue } from './appointments.model';

const STATUS_TRANSLATION_KEYS = {
  scheduled: 'APPOINTMENTS.STATUS.SCHEDULED',
  confirmed: 'APPOINTMENTS.STATUS.CONFIRMED',
  completed: 'APPOINTMENTS.STATUS.COMPLETED',
  cancelled: 'APPOINTMENTS.STATUS.CANCELLED',
  noshow: 'APPOINTMENTS.STATUS.NOSHOW',
} as const;

type StatusLookupKey = keyof typeof STATUS_TRANSLATION_KEYS;

const STATUS_BY_NUMBER: Record<string, StatusLookupKey> = {
  '0': 'scheduled',
  '1': 'confirmed',
  '2': 'completed',
  '3': 'cancelled',
  '4': 'noshow',
};

const DEFAULT_STATUS_KEY: StatusLookupKey = 'scheduled';

function resolveStatusKey(status: AppointmentStatusValue | string | null | undefined): StatusLookupKey {
  if (status === null || status === undefined) {
    return DEFAULT_STATUS_KEY;
  }

  const value = typeof status === 'number' ? status.toString() : status.toString().trim();
  if (value.length === 0) {
    return DEFAULT_STATUS_KEY;
  }

  if (typeof status === 'number') {
    return STATUS_BY_NUMBER[value] ?? DEFAULT_STATUS_KEY;
  }

  const numericKey = STATUS_BY_NUMBER[value];
  if (numericKey) {
    return numericKey;
  }

  const normalized = value.toLowerCase() as StatusLookupKey;
  return normalized in STATUS_TRANSLATION_KEYS ? normalized : DEFAULT_STATUS_KEY;
}

export function mapAppointmentStatusToTranslationKey(
  status: AppointmentStatusValue | string | null | undefined
): string {
  return STATUS_TRANSLATION_KEYS[resolveStatusKey(status)];
}

export function mapAppointmentStatusToCssClass(
  status: AppointmentStatusValue | string | null | undefined
): string {
  return resolveStatusKey(status);
}

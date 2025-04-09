export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PriorityLabel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY-HIGH',
}

export const PriorityValue: Record<PriorityLabel, number> = {
  [PriorityLabel.LOW]: 1,
  [PriorityLabel.MEDIUM]: 2,
  [PriorityLabel.HIGH]: 3,
  [PriorityLabel.VERY_HIGH]: 4,
}

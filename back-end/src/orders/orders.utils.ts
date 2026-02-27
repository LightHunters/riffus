export function buildQueuePositions(ids: string[]): Array<{ id: string; queuePosition: number }> {
  return ids.map((id, index) => ({ id, queuePosition: index + 1 }));
}

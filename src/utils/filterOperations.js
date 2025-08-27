export const filterOperationsWithActivity = (operations) => {
  if (!Array.isArray(operations)) return [];
  return operations.filter(op => 
    op.activity && 
    op.activity.trim() !== '' &&
    op.time_from !== op.time_to // Optionnel: filtrer les périodes de 0h
  );
};
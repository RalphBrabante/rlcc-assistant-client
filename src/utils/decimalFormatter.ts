export const formatToTwoDecimals = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^0-9.]/g, ''); // allow only numbers & decimal

  // Allow only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts[1];
  }

  // Limit to 2 decimal places
  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  input.value = value;
};
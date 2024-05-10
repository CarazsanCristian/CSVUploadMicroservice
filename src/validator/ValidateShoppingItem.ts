export function validateData(data: any): boolean {
  const keys = Object.keys(data);
  if (
    !data[keys[0]] ||
    !data[keys[1]] ||
    isNaN(parseInt(data[keys[2]])) ||
    isNaN(parseFloat(data[keys[3]]))
  ) {
    return false;
  }
  return true;
}

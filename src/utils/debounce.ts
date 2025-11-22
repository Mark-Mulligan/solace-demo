export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout = 750
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args); // safe; "this" is preserved if needed
    }, timeout);
  };
}

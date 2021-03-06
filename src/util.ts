/**
 * Enable and disabled hover effects by adding and removing a class from parent container.
 * @param container HTMLElement parent node containing all the elements that is to be checked.
 */
export const disableHoverOnTouch = (container: HTMLElement): void => {
  let lastTouchTime = 0;

  const enableHover = () => {
    if (new Date().getTime() - lastTouchTime < 500) return;
    container.classList.add('hasHover');
  };

  const disableHover = () => {
    container.classList.remove('hasHover');
  };

  const updateLastTouchTime = () => {
    lastTouchTime = new Date().getTime();
  };

  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);
}

export function debounce(callback: (...param: any) => void, wait: number = 300) {
  let timer: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timer);
    timer = setTimeout(() => { callback.apply(null, args) }, wait);
  }
}

/**
 * Helper to create a new Date object with the same values as the input
 * except the date is set to 1.
 * @param date 
 */
export const resetDate = (date: Date) => {
  let newDate = new Date()
  newDate.setFullYear(date.getFullYear());
  newDate.setMonth(date.getMonth());
  newDate.setDate(1);
  return newDate;
}
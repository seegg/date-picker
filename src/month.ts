import DatePicker from "./Datepicker";


/**
 * Create the element to display the month's name.
 * @param datePicker Current instance of DatePicker
 * @param names Names of the month
 * @returns Div Element for dispalying month name.
 */
export const createMonth = (datePicker: DatePicker, names: string[]) => {
  let monthDiv = document.createElement('div');
  let monthSelect = createMonthSelect(datePicker, names);
  monthDiv.id = 'picker-' + datePicker.id + '-month';
  monthDiv.classList.add('date-picker-month');
  monthDiv.innerHTML = names[datePicker.month];
  monthDiv.appendChild(monthSelect);

  monthDiv.onclick = () => {
    monthSelect.classList.add('date-picker-month-select-show')
    const chileElemHeight = monthSelect.firstElementChild?.getBoundingClientRect().height;
    monthSelect?.scrollTo(0, chileElemHeight! * (datePicker.month - 1) || 0);
    monthSelect?.focus();
  }
  return monthDiv;
}

/**
 * Create the menu for selecing a specific month.
 * @param datePicker Current instance of DatePicker
 * @param names Names of the month
 * @returns Div Element for dispalying month select.
 */
export const createMonthSelect = (datePicker: DatePicker, names: string[]) => {
  let monthSelect = document.createElement('div');
  monthSelect.classList.add('date-picker-month-select');
  monthSelect.tabIndex = -2;
  names.forEach((month, idx) => {
    let nameDiv = document.createElement('div');
    nameDiv.classList.add('date-picker-month-select-name');
    if (idx % 2 !== 0) nameDiv.classList.add('date-picker-month-name-alt');
    if (idx === datePicker.month) nameDiv.classList.add('date-picker-month-select-selected')
    nameDiv.innerHTML = month;
    nameDiv.onclick = () => { datePicker.setMonth(idx) };
    monthSelect.appendChild(nameDiv);
  })
  monthSelect.onblur = () => {
    monthSelect.classList.remove('date-picker-month-select-show');
  }

  return monthSelect;
}
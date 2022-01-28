import { DatePicker } from "./datepicker";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * create the html layout for the date picker.
 * @param datePicker current date picker instance
 * @returns HTMLDivElement layout for current date picker.
 */
export const createDatePickerElem = (datePicker: DatePicker) => {

  let pickerElem = document.createElement('div');
  pickerElem.onpointerup = () => {
    datePicker.isInSelectMode = false;
  };
  pickerElem.onpointerleave = () => {
    datePicker.isInSelectMode = false;
  };
  pickerElem.classList.add('date-picker');

  let monthDiv = createMonthElem(datePicker);
  let yearDiv = createYearElem(datePicker);
  let rightArrow = creatNavArrows('<', (datePicker.prevMonth.bind(datePicker)));
  let leftArrow = creatNavArrows('>', datePicker.nextMonth.bind(datePicker));
  let daysOfWeekLabels = createWeekLabelElem();
  //add the header elements for the date picker in order.
  let navContainer = document.createElement('div');
  navContainer.classList.add('date-picker-navHeader');
  navContainer.appendChild(rightArrow);
  navContainer.appendChild(monthDiv);
  navContainer.appendChild(yearDiv);
  navContainer.appendChild(leftArrow);
  pickerElem.appendChild(navContainer);

  pickerElem.appendChild(daysOfWeekLabels);

  pickerElem.oncontextmenu = (e) => { e.preventDefault(); };
  for (let i = 0; i < 6; i++) {
    let weekElem = document.createElement('div');
    weekElem.classList.add('date-picker-week');

    for (let j = 0; j < 7; j++) {
      let dayElem = createDayElem(datePicker, i * 7 + j);
      weekElem.appendChild(dayElem);
    }
    pickerElem.appendChild(weekElem);
  }
  return pickerElem;

};

const creatNavArrows = (icon: string, callback?: () => void) => {
  let arrow = document.createElement('div');
  arrow.classList.add('date-picker-navArrow');
  arrow.innerHTML = icon;
  arrow.onclick = () => { callback ? callback() : '' };
  return arrow;
}

/**
 * Create the element to display the month's name.
 * @param datePicker Current instance of DatePicker
 * @param names Names of the month
 * @returns Div Element for dispalying month name.
 */
const createMonthElem = (datePicker: DatePicker, names = months) => {
  let monthDiv = document.createElement('div');

  monthDiv.id = 'picker-' + datePicker.id + '-month';
  monthDiv.classList.add('date-picker-month');
  monthDiv.innerHTML = names[datePicker.month];
  return monthDiv;
}

/**
 * Create the element to display month select on click.
 * @param datePicker Current instance of DatePicker
 * @param names Names of the month
 * @returns Div Element for dispalying month select.
 */
const createMonthSelecElem = (datePicker: DatePicker, names = months) => {
  let monthSelect = document.createElement('div');
  monthSelect.classList.add('date-picker-month-select');

  return monthSelect;
}

/**
 * Create div element to display select year.
 * @param datePicker Current instance of DatePicker
 * @returns Div Element for displaying selected year.
 */
const createYearElem = (datePicker: DatePicker) => {
  let yearDiv = document.createElement('div');
  yearDiv.id = 'picker-' + datePicker.id + '-year';
  yearDiv.classList.add('date-picker-year');
  yearDiv.innerHTML = datePicker.year.toString();
  return yearDiv
}


const createWeekLabelElem = (weekLabel: string[] = daysOfTheWeek) => {
  let weekLabelDiv = document.createElement('div');
  weekLabelDiv.classList.add('date-picker-week', 'week-label');
  for (let i = 0; i < 7; i++) {
    let dayOfWeek = document.createElement('div');
    dayOfWeek.innerHTML = weekLabel[i];
    dayOfWeek.classList.add('day-of-week-label');
    if (i === 0) {
      dayOfWeek.classList.add('day-of-week-sun');
    }
    weekLabelDiv.appendChild(dayOfWeek);
  }
  return weekLabelDiv;
}

/**
 * Create the element for Day object.
 * @param datePicker current datePicker instance.
 * @param index index number of daysInMonth property from datePicker instance.
 * @returns HTMLDivElement for the selected date.
 */
const createDayElem = (datePicker: DatePicker, index: number) => {
  let dayEle = document.createElement('div');
  const date = datePicker.daysInMonth[index];
  dayEle.classList.add('date-picker-day');

  dayEle.onclick = () => {
    // datePicker.setSingleDateRange(index);
  }

  dayEle.oncontextmenu = () => {
    // datePicker.test();
  };

  dayEle.onpointerdown = (evt) => {
    if (evt.button === 2) return;
    datePicker.isInSelectMode = true;
    datePicker.setStartDateRange(index)
  };
  //only select dates on pointer move event if picker is in select mode.
  dayEle.onpointerenter = () => {
    if (datePicker.isInSelectMode) {
      datePicker.setEndDateRange(index)
    }
  };
  dayEle.onpointerup = () => {
    datePicker.isInSelectMode = false;
    datePicker.setEndDateRange(index)
  };
  if (date.month !== datePicker.month) dayEle.classList.add('not-current-month');
  let dateNumElem = document.createElement('p');
  dateNumElem.innerHTML = date.date.toString();
  dayEle.appendChild(dateNumElem);
  return dayEle;
};
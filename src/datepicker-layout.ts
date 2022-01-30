import DatePicker from "./Datepicker";
import { createDatesInMonth } from "./date";
import { createMonth } from "./month";
import { createYear } from "./year";
import { disableHoverOnTouch } from "./util";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfTheWeek = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'S'];
const arrowSymbols = ['<', '>'];

//values for year select input element
export const maxYearDefault = 9999;
export const minYearDefault = 1;

/**
 * create the html layout for the date picker.
 * @param datePicker current date picker instance
 * @returns HTMLDivElement layout for current date picker.
 */
export const createDatePickerLayout = (datePicker: DatePicker) => {

  let pickerElem = document.createElement('div');
  //event handlers dealing for toggling select mode to false
  pickerElem.onpointerup = () => {
    datePicker.setSelectMode(false);
  };
  pickerElem.onpointerleave = () => {
    datePicker.setSelectMode(false);
  };

  //can't pass white space or empty strings as parameter.
  pickerElem.classList.add('date-picker', `${datePicker.isInMultiMonthSelectMode ? 'date-picker-long-select' : 'date-picker'}`);

  let monthDiv = createMonth(datePicker, months);
  let yearDiv = createYear(datePicker);
  let rightArrow = creatNavArrows(arrowSymbols[0], (datePicker.prevMonth.bind(datePicker)));
  let leftArrow = creatNavArrows(arrowSymbols[1], datePicker.nextMonth.bind(datePicker));
  let daysOfWeekLabels = createWeekLabel();
  //add the header elements for the date picker in order.
  let navContainer = document.createElement('div');
  navContainer.classList.add('date-picker-navHeader');
  navContainer.appendChild(rightArrow);
  navContainer.appendChild(monthDiv);
  navContainer.appendChild(yearDiv);
  navContainer.appendChild(leftArrow);
  pickerElem.appendChild(navContainer);

  pickerElem.appendChild(daysOfWeekLabels);

  let daysContainer = createDatesInMonth(datePicker);
  pickerElem.appendChild(daysContainer);
  //disable context menu
  pickerElem.oncontextmenu = (e) => { e.preventDefault(); };
  disableHoverOnTouch(pickerElem);
  return pickerElem;

};


/**
 * Create the month navigation elements.
 * @param icon The string for the left and right navigation for the month.
 * @param callback onclick callback.
 * @returns 
 */
const creatNavArrows = (icon: string, callback?: () => void) => {
  let arrow = document.createElement('div');
  arrow.classList.add('date-picker-navArrow');
  arrow.innerHTML = icon;
  arrow.onpointerdown = () => { callback ? callback() : '' };
  return arrow;
}



/**
 * Create the element to display the names for the days of the week.
 * @param weekLabel array of names corrensponding to day of the week.
 * @returns 
 */
const createWeekLabel = (weekLabel: string[] = daysOfTheWeek) => {
  let weekLabelDiv = document.createElement('div');
  weekLabelDiv.classList.add('date-picker-week');
  for (let i = 0; i < 7; i++) {
    let dayOfWeek = document.createElement('div');
    dayOfWeek.innerHTML = weekLabel[i];
    dayOfWeek.classList.add('day-of-week-label', 'date-picker-label');
    if (i === 0) {
      dayOfWeek.classList.add('day-of-week-sun');
    }
    weekLabelDiv.appendChild(dayOfWeek);
  }
  return weekLabelDiv;
}


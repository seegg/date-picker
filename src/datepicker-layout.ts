import DatePicker from "./datepicker";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfTheWeek = ['S', 'M', 'Tu', 'W', 'Th', 'F', 'S'];
const arrowSymbols = ['<', '>'];

//values for year select input element
const maxYearDefault = 9999;
const minYearDefault = 0;
const stepDefault = 3;

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
  pickerElem.classList.add('date-picker');

  let monthDiv = createMonth(datePicker);
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

  pickerElem.oncontextmenu = (e) => { e.preventDefault(); };
  //container to hold the dates in the month. add an id to
  //change outline colour depending if it's in multi month select mode
  //or not.
  let daysContainer = document.createElement('div');
  daysContainer.id = 'days-container-' + datePicker.id;
  daysContainer.classList.add('date-picker-days-container');
  if (datePicker.isInMultiMonthSelectMode) {
    daysContainer.classList.add('date-picker-long-select');
  }

  //The dates are group into weeks which is then group together
  //in the daysContainer.
  for (let i = 0; i < 6; i++) {
    let weekElem = document.createElement('div');
    weekElem.classList.add('date-picker-week');

    for (let j = 0; j < 7; j++) {
      let dayElem = createDay(datePicker, i * 7 + j);
      weekElem.appendChild(dayElem);
    }
    daysContainer.appendChild(weekElem);
  }
  pickerElem.appendChild(daysContainer);
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
  arrow.onclick = () => { callback ? callback() : '' };
  return arrow;
}

/**
 * Create the element to display the month's name.
 * @param datePicker Current instance of DatePicker
 * @param names Names of the month
 * @returns Div Element for dispalying month name.
 */
const createMonth = (datePicker: DatePicker, names = months) => {
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
 * Create the element to display month select on click.
 * @param datePicker Current instance of DatePicker
 * @param names Names of the month
 * @returns Div Element for dispalying month select.
 */
const createMonthSelect = (datePicker: DatePicker, names = months) => {
  let monthSelect = document.createElement('div');
  monthSelect.classList.add('date-picker-month-select');
  monthSelect.tabIndex = 0;
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

/**
 * Create div element to display select year.
 * @param datePicker Current instance of DatePicker
 * @returns Div Element for displaying selected year.
 */
const createYear = (datePicker: DatePicker) => {
  let yearDiv = document.createElement('div');
  yearDiv.id = 'picker-' + datePicker.id + '-year';
  yearDiv.classList.add('date-picker-year');
  yearDiv.innerHTML = datePicker.year.toString();

  let yearSelect = createYearSelect(datePicker);
  yearDiv.appendChild(yearSelect);

  return yearDiv
}


const createYearSelect = (datepicker: DatePicker) => {
  let yearSelect = document.createElement('div');
  let yearInput = createYearSelectInput(datepicker.year);
  let yearItems = createYearSelectItems(datepicker, datepicker.year);
  yearInput.value = datepicker.year.toString();


  yearSelect.classList.add('date-picker-year-select');
  yearInput.classList.add('date-picker-year-select-input');
  yearSelect.tabIndex = 1;

  yearSelect.appendChild(yearInput);
  yearSelect.appendChild(yearItems);
  return yearSelect;
}

const createYearSelectInput = (year: number, max: number = maxYearDefault, min: number = minYearDefault, step: number = stepDefault) => {
  let yearInput = document.createElement('input');
  yearInput.type = 'number';
  yearInput.max = max.toString();
  yearInput.min = min.toString();
  yearInput.step = step.toString();
  return yearInput;
}

const createYearSelectItems = (datePicker: DatePicker, year: number, numberOfItems: number = 10) => {
  let yearItemContainer = document.createElement('div');
  yearItemContainer.classList.add('date-picker-year-select-item-container');
  let currentYear = year - 5 >= 0 ? year - 5 : 0;
  for (let i = 0; i < 10; i++) {
    let yearItem = document.createElement('div');
    let selectYear = currentYear + i;
    yearItem.innerHTML = selectYear.toString();
    yearItem.classList.add('date-picker-year-select-item');
    yearItem.onclick = () => {
      datePicker.setYear(selectYear);
    }
    yearItemContainer.appendChild(yearItem);
  }
  return yearItemContainer;
}


/**
 * 
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

/**
 * Create the element for Day object.
 * @param datePicker current datePicker instance.
 * @param index index number of daysInMonth property from datePicker instance.
 * @returns HTMLDivElement for the selected date.
 */
const createDay = (datePicker: DatePicker, index: number) => {
  let dayEle = document.createElement('div');
  const date = datePicker.daysInMonth[index];
  dayEle.classList.add('date-picker-day', 'date-picker-label');

  dayEle.oncontextmenu = () => {
    datePicker.setMultiMonthDateRange(index);
  };

  dayEle.onpointerdown = (evt) => {
    if (evt.button === 2) return;

    if (datePicker.isInMultiMonthSelectMode) {
      datePicker.setMultiMonthDateRange(index);
    } else {
      datePicker.isInSelectMode = true;
      datePicker.setStartDateRange(index)
    }
  };
  //only select dates on pointer move event if picker is in select mode.
  dayEle.onpointermove = (evt) => {
    evt.preventDefault();
    if (datePicker.isInSelectMode) {
      datePicker.setEndDateRange(index)
    }
  };

  dayEle.onpointerup = (evt) => {
    evt.stopPropagation();
    datePicker.setEndDateRange(index)
    datePicker.setSelectMode(false);
  };
  if (date.month !== datePicker.month) dayEle.classList.add('not-current-month');
  let dateNumElem = document.createElement('p');
  dateNumElem.innerHTML = date.date.toString();
  dayEle.appendChild(dateNumElem);
  return dayEle;
};

/**
 * Enable and disabled hover effects by adding and removing a class from parent container.
 * @param container HTMLElement parent node containing all the elements that is to be checked.
 */
const disableHoverOnTouch = (container: HTMLElement): void => {
  let lastTouchTime = 0;

  const enableHover = () => {
    if (new Date().getTime() - lastTouchTime < 500) return
    container.classList.add('hasHover')
  }

  const disableHover = () => {
    container.classList.remove('hasHover')
  }

  const updateLastTouchTime = () => {
    lastTouchTime = new Date().getTime();
  }

  document.addEventListener('touchstart', updateLastTouchTime, true)
  document.addEventListener('touchstart', disableHover, true)
  document.addEventListener('mousemove', enableHover, true)
}

function debounce(callback: () => void, wait: number = 300) {
  let timer: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timer);
    timer = setTimeout(() => { callback.apply(null, args) }, wait);
  }
}

import DatePicker from "./datepicker";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfTheWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const arrowSymbols = ['<', '>'];

/**
 * create the html layout for the date picker.
 * @param datePicker current date picker instance
 * @returns HTMLDivElement layout for current date picker.
 */
export const createDatePickerElem = (datePicker: DatePicker) => {

  let pickerElem = document.createElement('div');
  //event handlers dealing for toggling select mode to false
  pickerElem.onpointerup = () => {
    datePicker.setSelectMode(false);
  };
  pickerElem.onpointerleave = () => {
    datePicker.setSelectMode(false);
  };
  pickerElem.classList.add('date-picker');

  let monthDiv = createMonthElem(datePicker);
  let yearDiv = createYearElem(datePicker);
  let rightArrow = creatNavArrows(arrowSymbols[0], (datePicker.prevMonth.bind(datePicker)));
  let leftArrow = creatNavArrows(arrowSymbols[1], datePicker.nextMonth.bind(datePicker));
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
      let dayElem = createDayElem(datePicker, i * 7 + j);
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
const createMonthElem = (datePicker: DatePicker, names = months) => {
  let monthDiv = document.createElement('div');
  let monthSelect = createMonthSelecElem(datePicker, names);
  monthDiv.id = 'picker-' + datePicker.id + '-month';
  monthDiv.classList.add('date-picker-month');
  monthDiv.innerHTML = names[datePicker.month];
  monthDiv.appendChild(monthSelect);

  monthDiv.onclick = () => {
    monthSelect.classList.add('date-picker-month-select-show');
    monthSelect.focus();
  }
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
const createYearElem = (datePicker: DatePicker) => {
  let yearDiv = document.createElement('div');
  yearDiv.id = 'picker-' + datePicker.id + '-year';
  yearDiv.classList.add('date-picker-year');
  yearDiv.innerHTML = datePicker.year.toString();
  return yearDiv
}


/**
 * 
 * @param weekLabel array of names corrensponding to day of the week.
 * @returns 
 */
const createWeekLabelElem = (weekLabel: string[] = daysOfTheWeek) => {
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
const createDayElem = (datePicker: DatePicker, index: number) => {
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
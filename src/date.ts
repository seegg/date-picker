import DatePicker from "./Datepicker";

/**
 * Create the dates for the month.
 * @param datePicker DatePicker instance.
 * @returns HTMLDivElement container holding the dates for the month.
 */
export const createDatesInMonth = (datePicker: DatePicker) => {
  //container to hold the dates in the month. add an id to
  //change outline colour depending if it's in multi month select mode
  //or not.
  let daysContainer = document.createElement('div');
  daysContainer.id = 'days-container-' + datePicker.id;
  daysContainer.classList.add('date-picker-days-container');

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

  return daysContainer;
}

/**
 * Create the element for Day object.
 * @param datePicker current datePicker instance.
 * @param index index number of daysInMonth property from datePicker instance.
 * @returns HTMLDivElement for the selected date.
 */
const createDay = (datePicker: DatePicker, index: number) => {
  let dayEle = document.createElement('div');
  dayEle.setAttribute('data-index', index.toString());
  let isTouchInput = false;
  dayEle.classList.add('date-picker-day', 'date-picker-label');


  //event listeners
  dayEle.oncontextmenu = () => {
    datePicker.setMultiMonthDateRange(index);
    toggleLongSelect(datePicker);
  };

  dayEle.ontouchstart = (evt) => {
    isTouchInput = true;
  }

  dayEle.ontouchend = () => {
    console.log('end');
    datePicker.isInSelectMode = false;
    isTouchInput = false;
  }

  dayEle.ontouchcancel = () => {
    datePicker.isInSelectMode = false;
    isTouchInput = false;
  }

  //for touch devices
  let lastElement: HTMLElement | null = null;
  dayEle.ontouchmove = (evt) => {
    evt.preventDefault();
    if (datePicker.isInMultiMonthSelectMode) return;
    const { clientX, clientY } = evt.touches[0];
    let touchElement = document.elementFromPoint(clientX, clientY) as HTMLElement;
    if (lastElement === touchElement) return;
    lastElement = touchElement;
    if (touchElement.dataset.index) {
      datePicker.setEndDateRange(Number(Number(touchElement.dataset.index)));
    }
  }

  dayEle.onpointerdown = (evt) => {
    console.log('down');
    if (evt.button === 2) return;

    if (datePicker.isInMultiMonthSelectMode) {
      datePicker.setMultiMonthDateRange(index);
      toggleLongSelect(datePicker);
    } else {
      datePicker.isInSelectMode = true;
      datePicker.setStartDateRange(index)
    }
  };
  //only select dates on pointer move event if picker is in select mode.
  dayEle.onpointermove = (evt) => {
    if (isTouchInput) return;
    evt.preventDefault();
    if (datePicker.isInSelectMode) {
      datePicker.setEndDateRange(index)
    }
  };

  dayEle.onpointerup = (evt) => {
    console.log('up', datePicker.isInSelectMode);

    if (isTouchInput) return;

    evt.stopPropagation();
    datePicker.setEndDateRange(index)
    datePicker.setSelectMode(false);
  };

  const date = datePicker.daysInMonth[index];

  if (date.month !== datePicker.month) dayEle.classList.add('not-current-month');
  dayEle.innerHTML = date.date.toString();
  return dayEle;
};

const toggleLongSelect = (datePicker: DatePicker) => {
  if (datePicker.isInMultiMonthSelectMode) {
    datePicker.pickerView.container.classList.add('date-picker-long-select')
    console.log('add');
  } else {
    datePicker.pickerView.container.classList.remove('date-picker-long-select');
    console.log('remove');
  }
}

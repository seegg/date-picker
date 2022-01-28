interface IDay {
  date: number,
  dayOfWeek: number,
  month: number,
  year: number,
  toDate: () => Date
}

class DatePicker {
  id: number;
  month: number;
  year: number;
  daysInMonth: IDay[] = [];
  initialSelectedDate: IDay | null = null;
  startDate: IDay | null = null;
  endDate: IDay | null = null;
  isInSelectMode: boolean = false;
  isInMultiMonthSelectMode: boolean = false;
  pickerElem: HTMLDivElement;
  setDateCallback: (start: IDay, end: IDay) => any;
  static baseID = 1;
  /**
   * 
   * @param date Date object
   * @param callback Callback to handle when a date range has been selected, has access to startDate and endDate properties.
   */
  constructor(date: Date, callback: (start: IDay, end: IDay) => any) {
    this.id = DatePicker.baseID;
    DatePicker.baseID++;
    this.setDateCallback = callback;
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
    this.pickerElem = createDatePickerElem(this);
  }

  /**
   * 
   * @param year selected year.
   * @param month selected month.
   * @returns a list of 35 dates starting from monday of the selected week to sunday 5 weeks after.
   */
  static getDaysInMonth(year: number, month: number): IDay[] {
    let currentDate = new Date(year, month, 1);
    let currentDayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - currentDayOfWeek);
    let days: IDay[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Day(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }

  /**
   * Check whether the target date is within the range of the start and end dates.
   * @param target the target date
   * @param start the start date of the range
   * @param end the end date of the range
   * @returns boolean value whether target date is in range or not.
   */
  static checkIfDateIsWithinRange(target: Date, start: Date, end: Date) {
    return target.getTime() >= start.getTime() && target.getTime() <= end.getTime();
  }

  setYear(year: number) {
    this.year = year;
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
  }

  setMonth(month: number) {
    this.month = month;
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
  }

  setStartDateRange(index: number) {
    this.initialSelectedDate = this.daysInMonth[index];
    this.startDate = this.initialSelectedDate;
    this.endDate = this.initialSelectedDate;
  }

  setEndDateRange(index: number) {
    if (!this.initialSelectedDate) return;
    this.endDate = this.daysInMonth[index];
    //if the endate is before the initial date set the startdate back to the end date
    //and the end date to the initial date.
    if (this.endDate.toDate().getTime() < this.initialSelectedDate.toDate().getTime()) {
      this.startDate = this.endDate;
      this.endDate = this.initialSelectedDate;
    } else {
      this.startDate = this.initialSelectedDate;
    }
    this.highlightSelectedDateRange();
    //call back to handle the date picker's output
    this.setDateCallback(this.startDate, this.endDate);

  }

  /**
   * if the new selected range is a single date and the old range is also a single date
   * and if both are the same then set the start and end dates to null;
   */
  deSelecteDateRange() {

  }

  /**
   * toggle classes for .day elements to highlight those
   * in the selected date range.
   */
  highlightSelectedDateRange() {
    let dayElems = document.getElementsByClassName('day');
    this.daysInMonth.forEach((day, index) => {
      if (this.isInSelectedRange(day.toDate())) {
        dayElems[index].classList.add('day-selected');
      } else {
        dayElems[index].classList.remove('day-selected');
      }
    })
  }

  /**
   * Check if target date is within selected date range.
   * @param target target date
   * @returns boolean
   */
  isInSelectedRange(target: Date): boolean {
    if (this.startDate === null || this.endDate === null) return false;

    return DatePicker.checkIfDateIsWithinRange(target, this.startDate.toDate(), this.endDate.toDate());
  }

}


class Day implements IDay {
  date: number;
  dayOfWeek: number;
  month: number;
  year: number;
  constructor(year: number, month: number, date: number) {
    let tempDate = new Date(year, month, date);
    this.year = year;
    this.date = tempDate.getDate();
    this.dayOfWeek = tempDate.getDay();
    this.month = tempDate.getMonth();
  }

  toDate(): Date {
    return new Date(this.year, this.month, this.date);
  }
}

/**
 * create the html layout for the date picker.
 * @param datePicker current date picker instance
 * @returns HTMLDivElement layout for current date picker.
 */
const createDatePickerElem = (datePicker: DatePicker) => {

  let pickerElem = document.createElement('div');
  pickerElem.classList.add('date-picker');

  let rightArrow = creatNavArrows('<', () => { });
  let leftArrow = creatNavArrows('>', () => { });

  let navContainer = document.createElement('div');
  navContainer.classList.add('navHeader');
  navContainer.appendChild(rightArrow);
  navContainer.appendChild(leftArrow);

  pickerElem.appendChild(navContainer);
  pickerElem.oncontextmenu = (e) => { e.preventDefault(); };
  for (let i = 0; i < 6; i++) {
    let weekElem = document.createElement('div');
    weekElem.classList.add('week');

    for (let j = 0; j < 7; j++) {
      let dayElem = createDayElem(datePicker, i * 7 + j);
      weekElem.appendChild(dayElem);
    }
    pickerElem.appendChild(weekElem);
  }
  return pickerElem;

};

const creatNavArrows = (icon: string, callback: () => void) => {
  let arrow = document.createElement('div');
  arrow.classList.add('navArrow');
  arrow.innerHTML = icon;
  return arrow;
}

const createYearElem = (year: number) => {
  let yearDiv = document.createElement('div');
  yearDiv.innerHTML = year.toString();
}

const createMonthElem = (month: number) => {

}

const createWeekLabelElem = (weekLabel: string[]) => {

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
  dayEle.classList.add('day');
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

let picker = new DatePicker(new Date(), (start, end) => { });

const container = document.getElementById('date-picker');
container?.appendChild(picker.pickerElem);
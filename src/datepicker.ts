import './style.css';

import { createDatePickerElem } from './create-datepicker-layout';
interface IDay {
  date: number,
  dayOfWeek: number,
  month: number,
  year: number,
  toDate: () => Date
}

type DateCallbackFn = (startDate: Date | null, endDate: Date | null) => any;

export default class DatePicker {
  id: number;
  month: number;
  year: number;
  daysInMonth: IDay[] = [];
  initialSelectedDate: IDay | null = null;
  startDate: IDay | null = null;
  endDate: IDay | null = null;
  _prevStart: IDay | null = null;
  _prevEnd: IDay | null = null;
  isInSelectMode: boolean = false;
  isInMultiMonthSelectMode: boolean = false;
  pickerElem: HTMLDivElement;
  pickerElemContainer: HTMLDivElement;
  sendDateCallback: DateCallbackFn;
  sentSingleDate: boolean = false;
  static baseID = 1;
  /**
   * @param date Date object
   * @param callback Callback to handle when a date range has been selected, has access to startDate and endDate properties.
   */
  constructor(date: Date, callback: DateCallbackFn) {
    this.id = DatePicker.baseID;
    DatePicker.baseID++;
    this.sendDateCallback = callback;
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
    this.pickerElem = createDatePickerElem(this);
    this.pickerElemContainer = document.createElement('div');
    this.pickerElemContainer.id = 'date-picker-container-' + this.id;
    this.pickerElemContainer.classList.add('date-picker-container');
    this.pickerElemContainer.appendChild(this.pickerElem);
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

  /**
   * Set the year value for the Date picker, redraws the layout.
   * @param year 
   */
  setYear(year: number) {
    this.year = year;
    const newDate = new Date(this.year, this.month, 1);
    this.month = newDate.getMonth();
    this.year = newDate.getFullYear();
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
    const newPickerElem = createDatePickerElem(this);
    this.pickerElemContainer.replaceChild(newPickerElem, this.pickerElem);
    this.pickerElem = newPickerElem;
    this.highlightSelectedDateRange();
  }

  /**
   * Set the month value for the Date picker, redraws the layout.
   * @param month
   */
  setMonth(month: number) {
    this.month = month;
    const newDate = new Date(this.year, this.month, 1);
    this.month = newDate.getMonth();
    this.year = newDate.getFullYear();
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
    const newPickerElem = createDatePickerElem(this);
    this.pickerElemContainer.replaceChild(newPickerElem, this.pickerElem);
    this.pickerElem = newPickerElem;
    this.highlightSelectedDateRange();
  }

  nextMonth() {
    this.setMonth(this.month + 1);
  }

  prevMonth() {
    this.setMonth(this.month - 1);
  }

  setSelectMode(isOn: boolean) {
    this.isInSelectMode = isOn;
    this.triggerDateCallback();
  }

  /**
   * @returns The HTML layout for the date picker
   */
  getLayout() {
    return this.pickerElemContainer;
  }

  /**
   * Decide if conditions for triggering the callback to send the date values is meet.
   */
  triggerDateCallback() {
    let shouldSendCallback = false;
    //Is not in select mode and start date is not null.
    if (!this.isInSelectMode && this.startDate) {
      //Check if the current dates are the same as the previous dates sent
      if (Day.CompareDays(this.startDate, this._prevStart!) !== 0 ||
        Day.CompareDays(this.endDate!, this._prevEnd!) !== 0) {
        shouldSendCallback = true;
        this._prevStart = this.startDate;
        this._prevEnd = this.endDate;
        this.sentSingleDate = false;
        //Check if the start and end dates are the same.
      } else if (Day.CompareDays(this.startDate, this.endDate!) === 0 && !this.sentSingleDate) {
        shouldSendCallback = true;
        this.sentSingleDate = true;
      }
    }
    if (shouldSendCallback) this.sendDateCallback(this.startDate!.toDate(), this.endDate!.toDate());
  }

  /**
   * Set the initial values for initialSelectedDate startDate and endDate
   * reset date value if it's the same as previous values.
   * @param index The index of the Day object for daysInMonth array.
   */
  setStartDateRange(index: number) {
    this.initialSelectedDate = this.daysInMonth[index];
    this.startDate = this.initialSelectedDate;
    this.endDate = this.initialSelectedDate;

    //reset date values if it's the same as previous values.
    if (this.sentSingleDate && this._prevStart) {
      if (!Day.CompareDays(this.startDate, this.endDate)
        && !Day.CompareDays(this._prevEnd!, this._prevStart) && !Day.CompareDays(this.startDate, this._prevStart)) {
        this.deselectDateRange();
        return;
      }
    }
    this._prevStart = this.startDate;
    this._prevEnd = this.endDate;
    this.sentSingleDate = false;
    this.highlightSelectedDateRange();
  }

  setEndDateRange(index: number) {
    if (!this.initialSelectedDate || !this.isInSelectMode) return;
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
  }

  deselectDateRange() {
    this.sentSingleDate = false;
    this.isInSelectMode = false;
    this.startDate = null;
    this.endDate = null;
    this._prevEnd = null;
    this._prevStart = null;
    this.sendDateCallback(this.startDate, this.endDate);
    this.highlightSelectedDateRange();
  }

  /**
   * toggle classes for .day elements to highlight those
   * in the selected date range.
   */
  highlightSelectedDateRange() {
    let dayElems = document.getElementsByClassName('date-picker-day');
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

  /**
   * Compare the time between two Day instances.
   * @param dayOne Day instance one
   * @param dayTwo Day instance two
   * @returns -1 if dayOne is greater than dayTwo, 1 if dayTwo is greater, 0 if they are equal.
   */
  static CompareDays(dayOne: IDay, dayTwo: IDay) {
    let dayOneTime = dayOne.toDate().getTime();
    let dayTwoTime = dayTwo.toDate().getTime();
    return dayOneTime > dayTwoTime ? -1 : dayTwoTime > dayOneTime ? 1 : 0;
  }

  /**
   * @returns Date object representing the Day instance.
   */
  toDate(): Date {
    return new Date(this.year, this.month, this.date);
  }
}

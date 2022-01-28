import { createDatePickerElem } from './create-datepicker-layout'
interface IDay {
  date: number,
  dayOfWeek: number,
  month: number,
  year: number,
  toDate: () => Date
}

export class DatePicker {
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
  setDateCallback: (start: Date, end: Date) => any;
  sentSingDate: boolean = false;
  static baseID = 1;
  /**
   * 
   * @param date Date object
   * @param callback Callback to handle when a date range has been selected, has access to startDate and endDate properties.
   */
  constructor(date: Date, callback: (start: Date, end: Date) => any) {
    this.id = DatePicker.baseID;
    DatePicker.baseID++;
    this.setDateCallback = callback;
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
    this.triggerCallDateCallback();
  }

  /**
   * Decide if conditions for triggering the callback to send the date values is meet.
   */
  triggerCallDateCallback() {
    //Is not in select mode and start date is not null.
    if (!this.isInSelectMode && this.startDate) {
      if (this.startDate.toDate().getTime() !== this._prevStart?.toDate().getTime() ||
        this.endDate?.toDate().getTime() !== this._prevEnd?.toDate().getTime()) {
        this.setDateCallback(this.startDate.toDate(), this.endDate!.toDate());
        this._prevStart = this.startDate;
        this._prevEnd = this.endDate;
        this.sentSingDate = false;
      } else if (this.startDate.toDate().getTime() === this.endDate?.toDate().getTime() && !this.sentSingDate) {
        this.setDateCallback(this.startDate.toDate(), this.endDate!.toDate());
        this.sentSingDate = true;
      }
    }
  }

  /**
   * Set the initial values for initialSelectedDate startDate and endDate
   * @param index The index of the Day object for daysInMonth array.
   */
  setStartDateRange(index: number) {
    this.initialSelectedDate = this.daysInMonth[index];
    if (this.sentSingDate) {
    }
    this.startDate = this.initialSelectedDate;
    this.endDate = this.initialSelectedDate;
    this._prevStart = this.startDate;
    this._prevEnd = this.endDate;
    this.sentSingDate = false;
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
    this.startDate = null;
    this.endDate = null;
    this._prevEnd = null;
    this._prevStart = null;
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



let picker = new DatePicker(new Date(), (start, end) => { console.log(start, end) });

const container = document.getElementById('date-picker');
container?.appendChild(picker.pickerElemContainer); 
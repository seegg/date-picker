import './style.css';

import { createDatePickerLayout, IPickerConfig, maxYearDefault as maxYear, minYearDefault as minYear } from './datepicker-layout';
import { resetDate } from './util';
interface IDay {
  date: number,
  dayOfWeek: number,
  month: number,
  year: number,
  fullDate: Date,
  toDate: () => Date
}

interface IPickerView {
  container: HTMLDivElement,
  layout: HTMLDivElement,
}

type DateCallbackFn = (startDate: Date | null, endDate: Date | null, isDone: boolean) => void;

export default class DatePicker {
  id: number;
  isSingleSelect: boolean;
  fullDate: Date;
  daysInMonth: IDay[] = [];
  initialSelectedDate: IDay | null = null;
  startDate: IDay | null = null;
  endDate: IDay | null = null;
  isSameDateValues = true;
  isInSelectMode: boolean = false;
  isInMultiMonthSelectMode: boolean = false;
  pickerView: IPickerView;
  sendDateCallback: DateCallbackFn;
  static baseID = 1;
  /**
   * @param date Date object
   * @param callback Callback to handle when a date range has been selected, has access to startDate and endDate properties.
   */
  constructor(date: Date, callback: DateCallbackFn, singleSelect: boolean = false, config?: IPickerConfig | null) {
    this.id = DatePicker.baseID;
    DatePicker.baseID++;
    this.isSingleSelect = singleSelect;
    this.fullDate = date;
    this.sendDateCallback = callback;
    this.daysInMonth = DatePicker.GetDaysInMonth(this.fullDate.getFullYear(), this.fullDate.getMonth());
    this.pickerView = createDatePickerLayout(this, config);
  }

  /**
   * Generate the Day objects relating to the days in the month.
   * @param year selected year.
   * @param month selected month.
   * @returns a list of 35 dates starting from monday of the selected week to sunday 5 weeks after.
   */
  static GetDaysInMonth(year: number, month: number): IDay[] {
    let currentDate = new Date(year, month, 1);
    currentDate.setFullYear(year);
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
  static IsDateWithinRange(target: Date, start: Date, end: Date) {
    return target.getTime() >= start.getTime() && target.getTime() <= end.getTime();
  }

  get month() {
    return this.fullDate.getMonth();
  }

  get year() {
    return this.fullDate.getFullYear();
  }

  setSingleSelect(singleSelect: boolean) {
    this.isSingleSelect = singleSelect;
  }

  deSelect() {
    this.startDate = null;
    this.endDate = null;
    this.isInMultiMonthSelectMode = false;
    this.isInSelectMode = false;
    this.highlightSelectedDateRange();
  }

  reset(date: Date = new Date()) {
    this.deSelect();
    this.fullDate = date;
    this.daysInMonth = DatePicker.GetDaysInMonth(this.year, this.month);
    const view = createDatePickerLayout(this);
    this.updateView(view);
  }

  /**
   * Set the year value for the Date picker, redraws the layout.
   * @param year 
   */
  setYear(year: number) {
    if (this.year === year) return;
    let yearTemp = year > maxYear ? maxYear : year < minYear ? minYear : year;
    this.fullDate.setFullYear(yearTemp);
    this.daysInMonth = DatePicker.GetDaysInMonth(this.year, this.month);
    const view = createDatePickerLayout(this);
    this.updateView(view);
  }

  /**
   * Set the month value for the Date picker, redraws the layout.
   * @param month
   */
  setMonth(month: number) {
    if (this.month === month) return;
    if (this.fullDate.getFullYear() === maxYear && month > 11) return;
    if (this.fullDate.getFullYear() === minYear && month < 0) return;
    this.fullDate.setMonth(month);
    this.daysInMonth = DatePicker.GetDaysInMonth(this.year, this.month);
    const view = createDatePickerLayout(this);
    this.updateView(view);
  }

  updateView(view: IPickerView) {
    this.pickerView.container.replaceChild(view.layout, this.pickerView.layout);
    this.pickerView.layout = view.layout;
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
    return this.pickerView.container;
  }

  /**
   * Decide if conditions for triggering the callback to send the date values is meet.
   */
  triggerDateCallback() {
    if (this.isSameDateValues) return;
    if (this.isInMultiMonthSelectMode) return;
    //Is not in select mode and start date and end date is not null.
    if (!this.isInSelectMode && this.startDate && this.endDate) {
      this.sendDateCallback(this.startDate!.toDate(), this.endDate!.toDate(), !this.isInMultiMonthSelectMode);
      this.isSameDateValues = true;
    }
  }

  /**
   * Set the initial values for initialSelectedDate startDate and endDate
   * reset date value if it's in the same range as previous values.
   * @param index The index of the Day object for daysInMonth array.
   */
  setStartDateRange(index: number) {

    this.initialSelectedDate = this.daysInMonth[index];

    //Reset all selection if the new start date is within the range of the previous selection.
    if (this.startDate && this.endDate && this.isInSelectedRange(this.initialSelectedDate.toDate())) {
      this.deselectDateRange();
    } else {
      this.isSameDateValues = false;
      this.startDate = this.initialSelectedDate;
      this.endDate = this.initialSelectedDate;
    }

    if (this.isSingleSelect) {
      this.setEndDateRange(index);
      this.isInSelectMode = false;
    }


    this.highlightSelectedDateRange();
  }

  /**
   * Set the end date for selection.
   * @param index The index in daysInMonth corresponding to the selected date.
   * @returns void
   */
  setEndDateRange(index: number) {
    //return if no date has been selected or if it's not in select mode.
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

  /**
   * Select a date range across multiple different months. or not, but you can if you want.
   * @param index Index of the Day object relating to a certain date of the month
   */
  setMultiMonthDateRange(index: number) {
    if (this.isSingleSelect) return;
    const daysContainer = document.getElementById('days-container-' + this.id);
    //Select initial values if isInMultiMonthSelectMode is false initially.
    if (!this.isInMultiMonthSelectMode) {
      this.isSameDateValues = false;
      this.initialSelectedDate = this.daysInMonth[index];
      this.isInSelectMode = false;
      this.isInMultiMonthSelectMode = true;
      this.startDate = this.initialSelectedDate;
      this.endDate = this.initialSelectedDate;
      // daysContainer?.classList.add('date-picker-long-select');
    } else {
      //final values.
      // daysContainer?.classList.remove('date-picker-long-select');
      this.endDate = this.daysInMonth[index];
      if (Day.CompareDays(this.startDate!, this.endDate)! < 0) {
        this.startDate = this.endDate;
        this.endDate = this.initialSelectedDate;
      }
      this.isInMultiMonthSelectMode = false;
    }

    //always trigger callback to send dates.
    this.sendDateCallback(this.startDate!.toDate(), this.endDate!.toDate(), !this.isInMultiMonthSelectMode);
    this.highlightSelectedDateRange();
    this.isSameDateValues = true;
  }

  /**
   * reset date range selection.
   */
  deselectDateRange() {
    this.isInSelectMode = false;
    this.startDate = null;
    this.endDate = null;
    this.sendDateCallback(this.startDate, this.endDate, !this.isInMultiMonthSelectMode);
  }

  /**
   * toggle classes for .day elements to highlight those
   * in the selected date range.
   */
  highlightSelectedDateRange() {
    let dayElems = this.pickerView.container.getElementsByClassName('date-picker-day');
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

    return DatePicker.IsDateWithinRange(target, this.startDate.toDate(), this.endDate.toDate());
  }

}

class Day implements IDay {
  fullDate: Date;
  constructor(year: number, month: number, date: number) {
    let tempDate = new Date(year, month, date);
    tempDate.setFullYear(year);
    this.fullDate = tempDate;
  }

  /**
   * Compare the time between two Day instances.
   * @param dayOne Day instance one
   * @param dayTwo Day instance two
   * @returns return -1 if dayOne is greater than dayTwo, 1 if dayTwo is greater, 0 if they are equal.
   */
  static CompareDays(dayOne: IDay, dayTwo: IDay) {
    if (dayOne === null || dayTwo === null) return undefined;
    let dayOneTime = dayOne.toDate().getTime();
    let dayTwoTime = dayTwo.toDate().getTime();
    return dayOneTime > dayTwoTime ? -1 : dayTwoTime > dayOneTime ? 1 : 0;
  }

  get year() {
    return this.fullDate.getFullYear();
  }

  get month() {
    return this.fullDate.getMonth();
  }

  get date() {
    return this.fullDate.getDate();
  }

  get dayOfWeek() {
    return this.fullDate.getDay();
  }

  /**
   * @returns Date object representing the Day instance.
   */
  toDate(): Date {
    return this.fullDate;
  }
}

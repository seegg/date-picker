interface IDay {
  date: number,
  dayOfWeek: number,
  month: number,
  year: number,
}

class DatePicker {
  month: number;
  year: number;
  daysInMonth: IDay[] = [];
  constructor() {
    const date = new Date();
    this.month = date.getMonth();
    this.year = date.getFullYear();
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
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

  setYear(year: number) {
    this.year = year;
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
  }

  setMonth(month: number) {
    this.month = month;
    this.daysInMonth = DatePicker.getDaysInMonth(this.year, this.month);
  }

  selectDate() {

  }

  selectDateRange() {

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
}


const createDatePickerElem = () => {
  let datePicker = new DatePicker();

  const container = document.getElementById('date-picker');

  let pickerElem = document.createElement('div');
  pickerElem.classList.add('date-picker');

  //create element and layout for the weeks in the month
  for (let i = 0; i < 6; i++) {
    let week = document.createElement('div');
    week.classList.add('week');
    for (let j = 0; j < 7; j++) {
      let day = document.createElement('div');
      let dayNum = document.createElement('p');
      let date = datePicker.daysInMonth[i * 7 + j];
      day.classList.add('day');
      day.onpointerdown = (ev) => {
        (ev.currentTarget as HTMLDivElement).classList.toggle('day-selected');
      }
      if (date.month !== datePicker.month) day.classList.add('not-current-month');
      dayNum.innerHTML = date.date.toString();
      day.appendChild(dayNum);
      week.appendChild(day);
    }
    pickerElem.appendChild(week);
  }

  container?.appendChild(pickerElem);

};

const createDayElem = (datePicker: DatePicker, index: number) => {
  let dayEle = document.createElement('div');
  dayEle.classList.add('day');
  dayEle.onclick = (ev: MouseEvent) => {
    (ev.currentTarget as HTMLDivElement).classList
  };

};

createDatePickerElem();
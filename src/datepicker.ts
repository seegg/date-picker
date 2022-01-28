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
  startDate: IDay | null = null;
  endDate: IDay | null = null;
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

  selectDateStart(index: number) {
    console.log(index);
  }

  selectDateEnd(index: number) {
    console.log(index);
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


  for (let i = 0; i < 6; i++) {
    let weekElem = document.createElement('div');
    weekElem.classList.add('week');

    for (let j = 0; j < 7; j++) {
      let dayElem = createDayElem(datePicker, i * 7 + j);
      weekElem.appendChild(dayElem);
    }
    pickerElem.appendChild(weekElem);
  }

  container?.appendChild(pickerElem);

};

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
  dayEle.onpointerdown = () => {
    datePicker.selectDateStart(index)
  };
  dayEle.onpointermove;
  dayEle.onpointerup = () => {
    datePicker.selectDateEnd(index)
  };
  if (date.month !== datePicker.month) dayEle.classList.add('not-current-month');
  let dateNumElem = document.createElement('p');
  dateNumElem.innerHTML = date.date.toString();
  dayEle.appendChild(dateNumElem);
  return dayEle;
};

createDatePickerElem();
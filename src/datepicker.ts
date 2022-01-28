interface IDay {
  date: number,
  dayOfWeek: number,
  month: number,
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

  static getDaysInMonth(year: number, month: number): IDay[] {
    let currentDate = new Date(year, month, 1);
    let days: IDay[] = [];
    while (currentDate.getMonth() === month) {
      days.push({ date: currentDate.getDate(), dayOfWeek: currentDate.getDay(), month });
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

}


class Day implements IDay {
  date: number;
  dayOfWeek: number;
  month: number;
  constructor(year: number, month: number, date: number) {
    let tempDate = new Date(year, month, date);
    this.date = tempDate.getDate();
    this.dayOfWeek = tempDate.getDay();
    this.month = tempDate.getMonth();
  }
}


function getMonthElem() {

}
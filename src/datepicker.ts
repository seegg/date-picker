import './style.css';

const DatePicker = (): HTMLDivElement => {
  let container = document.createElement('div');
  container.classList.add('date-picker');
  container.appendChild(weekLabels(['S', 'M', 'T', 'W', 'T', 'F', 'S']))
  container.appendChild(month());
  document.getElementById('date-picker')?.append(container);
  return container;
}


const day = (dow: string) => {
  let day = document.createElement('div');
  day.classList.add('day');
  day.innerHTML = dow;
  return day;
}

/**
 * 
 * @param labels Text symbols for days of the week.
 * @returns A HTMLDivElement containing displays for the days of the week.
 */
const weekLabels = (labels: string[]) => {
  let weekLabels = document.createElement('div');
  weekLabels.classList.add('week');
  for (let i = 0; i < labels.length; i++) {
    let temp = day(labels[i]);
    temp.classList.add('day-label');
    weekLabels.appendChild(temp);
  }
  return weekLabels;
}

const week = () => {
  let week = document.createElement('div');
  week.classList.add('week');
  for (let i = 0; i < 7; i++) {
    week.appendChild(day('0' + i.toString()));
  }
  return week;
}

const month = () => {
  let month = document.createElement('div');
  month.classList.add('month');
  for (let i = 0; i < 5; i++) {
    month.appendChild(week());
  }
  return month;
}

DatePicker();
import './style.css';

const DatePicker = (): HTMLDivElement => {
  let container = document.createElement('div');
  container.classList.add('date-picker');

  document.getElementById('date-picker')?.append(container);
  return container;
}

DatePicker();
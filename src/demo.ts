import DatePicker from './datepicker';

let picker = new DatePicker(new Date(9999, 2, 1), (start, end) => {
  let input = document.getElementById('date-input') as HTMLInputElement;
  if (start === null || end === null) {
    input.value = '';
  } else if (start.getTime() === end.getTime()) {
    input.value = formatDate(start);
  } else {
    input.value = formatDate(start) + ' to ' + formatDate(end);
  }
});

const secondDisplay = document.createElement('div');
// secondDisplay.style.width = '200px';
secondDisplay.style.height = '50px';

let picker2 = new DatePicker(new Date(-5000000000000), (start, end) => {
  if (start && end) {
    secondDisplay.innerHTML = `start: ${formatDate(start)} end: ${formatDate(end)}`;
  } else {
    secondDisplay.innerHTML = 'no dates selected';
  }
})

const formatDate = (date: Date | null): string => {
  return date ? `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}` : '';
}
const container = document.getElementById('date-picker');
container?.appendChild(picker.getLayout());
container?.appendChild(document.createElement('br'));
container?.appendChild(picker2.getLayout());
container?.appendChild(document.createElement('br'));
container?.appendChild(secondDisplay);
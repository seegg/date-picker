import DatePicker from './Datepicker';

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


let picker2 = new DatePicker(new Date(), (start, end, isDone) => {
  let input = document.getElementById('date-display-2') as HTMLDivElement;
  if (start === null || end === null) {
    input.innerHTML = '';
  } else if (start.getTime() === end.getTime()) {
    input.innerHTML = formatDate(start);
  } else {
    input.innerHTML = formatDate(start) + ' to ' + formatDate(end);
  }
  if (isDone) {
    container2?.classList.add('hide');
    picker2.reset();
  }
})

const formatDate = (date: Date | null): string => {
  return date ? `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}` : '';
}
const container1 = document.getElementById('date-picker1');
container1?.appendChild(picker.getLayout());
const container2 = document.getElementById('date-picker2');
container2?.appendChild(picker2.getLayout());
// container?.appendChild(picker2.getLayout());
// container?.appendChild(secondDisplay);
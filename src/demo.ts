import DatePicker from './datepicker';

let picker = new DatePicker(new Date(), (start, end) => {
  let input = document.getElementById('date-input') as HTMLInputElement;
  if (!start || !end) {
    input.value = '';
  } else if (start.getTime() === end.getTime()) {
    input.value = formatDate(start);
  } else {
    input.value = formatDate(start) + ' to ' + formatDate(end);
  }
});

const formatDate = (date: Date | null): string => {
  return date ? `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}` : '';
}

document.getElementById('date-picker')?.appendChild(picker.getLayout());
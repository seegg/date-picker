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

let picker2 = new DatePicker(new Date(2000, 5, 1), (start, end) => {
  if (start && end) {
    console.log('start:', formatDate(start), 'end:', formatDate(end));
  } else {
    console.log('no dates selected')
  }
})

const formatDate = (date: Date | null): string => {
  return date ? `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}` : '';
}
const container = document.getElementById('date-picker');
container?.appendChild(picker.getLayout());
container?.appendChild(document.createElement('br'));
container?.appendChild(picker2.getLayout());
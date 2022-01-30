import DatePicker from "./datepicker";
import { debounce } from "./util";
import { maxYearDefault, minYearDefault } from "./datepicker-layout";

/**
 * Create div element to display select year.
 * @param datePicker Current instance of DatePicker
 * @returns Div Element for displaying selected year.
 */
export const createYear = (datePicker: DatePicker) => {
  let yearDiv = document.createElement('div');
  yearDiv.id = 'picker-' + datePicker.id + '-year';
  yearDiv.classList.add('date-picker-year');
  yearDiv.innerHTML = datePicker.year.toString();

  let yearSelect = createYearSelect(datePicker);

  yearDiv.appendChild(yearSelect);

  //show and set focus to the year select menu
  //the select menu will then transfer focus to its input
  //child element.
  yearDiv.onclick = () => {
    yearSelect.classList.add('date-picker-year-select-show');
    yearSelect.focus();
  }
  return yearDiv;
}

/**
 * create the year selection menu.
 * @param datepicker DatePicker instance
 * @returns Year selection menu
 */
const createYearSelect = (datepicker: DatePicker) => {
  let yearSelect = document.createElement('div');
  let yearInput = createYearSelectInput(datepicker.year);
  let yearItems = createYearSelectItems(datepicker, datepicker.year);
  yearSelect.classList.add('date-picker-year-select');
  yearInput.classList.add('date-picker-year-select-input');
  yearSelect.tabIndex = -1;

  //debounce function to wait on year input and change
  //the year selection base on new input.
  const replaceSelection = debounce(updateYearSelectItems);
  //regex for year string 1 to 9999 or empty string
  const yearRegex = /^[1-9][0-9]{0,3}$|(^$)/i;

  //keep track of the last valid value for Input element.
  let currentInputValue = yearInput.value;

  yearInput.addEventListener('input', () => {
    if (yearRegex.test(yearInput.value)) {
      currentInputValue = yearInput.value;
      replaceSelection(yearSelect, datepicker, Number(currentInputValue) || '');
    } else {
      yearInput.value = currentInputValue;
    }
  });


  //check if the blur event is from seleting another element
  //inside the parent element do nothing if that's the case.
  yearInput.onblur = (evt) => {
    if (yearSelect.contains(evt.relatedTarget as HTMLElement)) return;
    yearSelect.classList.remove('date-picker-year-select-show');
    //reset the year select menu with default values.
    updateYearSelectItems(yearSelect, datepicker, datepicker.year);
  }

  //transfer focus to the input element.
  yearSelect.onfocus = () => {
    yearInput.value = datepicker.year.toString();
    yearInput.dispatchEvent(new Event('input'));

    // debounce(scrollToSelectedYear, 50)(yearItems, Number(yearInput.value) || null);
    scrollToSelectedYear(yearSelect, Number(yearInput.value) || null);
    yearInput.focus();
  }

  yearSelect.appendChild(yearInput);
  yearSelect.appendChild(yearItems);
  return yearSelect;
}

/**
 * Updates the years on the year selection menu
 * @param parentElem menu container
 * @param datePicker 
 * @param year updated year.
 */
const updateYearSelectItems = (parentElem: HTMLDivElement, datePicker: DatePicker, year: number | null) => {
  let updatedItems = year ? createYearSelectItems(datePicker, year) : document.createElement('div');
  if (year) {
    updatedItems = createYearSelectItems(datePicker, year);
  } else {
    console.log('empty');
    updatedItems = document.createElement('div');
    updatedItems.classList.add('date-picker-year-select-empty');
  }
  parentElem.replaceChild(updatedItems, parentElem.childNodes[1]);
  scrollToSelectedYear(parentElem, year || null);
}

/**
 * Scroll to a specific year in the year select menu
 */
const scrollToSelectedYear = (yearSelect: HTMLDivElement, year: number | null) => {
  if (year === null) return;
  try {
    const yearItems = yearSelect.childNodes[1] as HTMLDivElement;
    const firstChildNode = yearItems.firstChild as HTMLDivElement;
    const yearDifference = year - Number(firstChildNode.innerHTML);
    const height = firstChildNode.getBoundingClientRect().height;
    yearItems.scrollTo(0, (yearDifference - 2) * height);
  } catch (err) {
    console.log(err);
  }
}

/**
 * create menu items for selecting a year.
 * @param datePicker instance of DatePicker
 * @param year 
 * @param max max year for selection
 * @param min min year for selection
 * @param numberOfItems the number of years to generate for selection.
 * @returns 
 */
const createYearSelectItems = (datePicker: DatePicker, year: number, max: number = maxYearDefault,
  min: number = minYearDefault, numberOfItems: number = 10) => {

  let yearItemContainer = document.createElement('div');
  let itemCount = max - min >= numberOfItems ? numberOfItems : max - min;
  yearItemContainer.classList.add('date-picker-year-select-item-container');

  //check the min and min values when adding and subtracting from half of the item count.
  let currentYear = year - Math.floor(itemCount / 2) >= min ? year - Math.floor(itemCount / 2) : min;
  currentYear = year + Math.ceil(itemCount / 2) <= max ? year : max - itemCount;

  for (let i = 0; i <= itemCount; i++) {
    let yearItem = document.createElement('div');
    yearItem.tabIndex = -(i + 100);

    //forms a closure for the setYear callback.
    let selectYear = currentYear + i;
    yearItem.innerHTML = selectYear.toString();

    //highlight the item if selectYear is the same as the date picker's current year.
    const selectedClass = selectYear === year ?
      'date-picker-year-select-selected' : 'date-picker-year-select-item';

    yearItem.classList.add('date-picker-year-select-item', selectedClass);

    yearItem.onclick = () => {
      datePicker.setYear(selectYear);
    }
    yearItemContainer.appendChild(yearItem);
  }

  return yearItemContainer;
}

/**
 * Create the input element for year select.
 * @returns 
 */
const createYearSelectInput = (year: number) => {

  let yearInput = document.createElement('input');
  yearInput.type = 'text';
  yearInput.value = year.toString();

  return yearInput;
}
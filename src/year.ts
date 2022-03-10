import DatePicker from "./Datepicker";
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
  let yearSelectItems = createYearSelectItems(datepicker, datepicker.year);
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
  yearSelect.appendChild(yearSelectItems);
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
  min: number = minYearDefault, numberOfItems: number = 20) => {

  let yearItemContainer = document.createElement('div');
  let itemCount = max - min >= numberOfItems ? numberOfItems : max - min;
  yearItemContainer.classList.add('date-picker-year-select-item-container');

  //starting year on the selection menu.
  let minYear = year - itemCount >= min ? year - itemCount : min;

  //seperate create items into own function to make it easier to replace.
  //for inifinite scrolling effect.
  const createItems = () => {
    const items: HTMLDivElement[] = [];
    for (let i = 0; i <= itemCount * 2; i++) {

      let selectYear = minYear + i;
      if (selectYear > max) break;
      if (minYear < min) break;

      //highlight the item if selectYear is the same as the date picker's current year.
      const selectedClass = selectYear === year ?
        'date-picker-year-select-selected' : 'date-picker-year-select-item';

      items.push(createSelectItem(selectYear, datePicker, 'date-picker-year-select-item', selectedClass));
    }
    return items;
  }

  yearItemContainer.replaceChildren(...createItems());

  //inifinite scrolling for year selection.
  yearItemContainer.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = yearItemContainer;
    //top scrolling, change min year by subtracting item count, 
    //create new select items and prepend it to container.
    if (scrollTop === 0) {
      let temp = minYear - numberOfItems;
      if (temp <= min) return;
      const yearDifference = minYear - temp;
      minYear = temp;
      yearItemContainer.replaceChildren(...createItems());
      const { height } = (yearItemContainer.firstChild as HTMLDivElement).getBoundingClientRect();
      yearItemContainer.scrollTo(0, height * yearDifference);
    }

    //bottom scrolling, same as top scrolling but adding to min year intead and append.
    if (scrollHeight - scrollTop === clientHeight) {
      let temp = minYear + numberOfItems;
      if (temp >= max) return;
      const yearDifference = temp - minYear;
      console.log(temp, minYear, yearDifference);
      minYear = temp;
      yearItemContainer.replaceChildren(...createItems());
      const { height } = (yearItemContainer.firstChild as HTMLDivElement).getBoundingClientRect();
      yearItemContainer.scrollTo(0, scrollHeight - clientHeight - (height * yearDifference));
    }
  })

  return yearItemContainer;
}

/**
 * Create a year select item.
 * @param selectYear year date
 * @param datePicker DatePicker object
 * @param classes css classes for the year select item
 */
const createSelectItem = (selectYear: number, datePicker: DatePicker, ...classes: string[]) => {
  const yearSelectItem = document.createElement('div');
  yearSelectItem.tabIndex = -1;
  const yearText = document.createTextNode(selectYear.toString());
  yearSelectItem.appendChild(yearText);
  yearSelectItem.classList.add(...classes);
  yearSelectItem.onclick = () => { datePicker.setYear(selectYear) };
  return yearSelectItem;
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
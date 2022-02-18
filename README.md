# date picker

# [Demo](https://seegg.github.io/date-picker)

### create a new Date Picker:

The constructor accepts a Date object and a callback function as arguments. The start date and the end date selected from the date picker is passed to the callback. 

```
const datePicker = new DatePicker(Date, Callback)

const callback = (startDate, endDate)=>{/* do stuff */}
```

Set a specific month or year. Months are 0 index.

```
datePicker.setMonth(2)
datePick.setYear(2002)
datePicker.setDate(new Date())
```

Get the layout, returns the HTMLElement containing the date picker.

```
datePicker.getLayout()
```

#### Picking a date

Click on a date on the picker to select it.

Click and drag across multiple boxes to select a range of dates.

Click on the month to select a specific month.

Click on the year to select a specific year.

To make a selection across multiple months, use context menu to select the first date and then use either normal click or context menu to select the second date.

reset selection by clicking on one of the selected dates.

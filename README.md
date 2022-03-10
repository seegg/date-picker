# date picker

# [Demo](https://seegg.github.io/date-picker)

### create a new Date Picker:

The constructor accepts a Date object and a callback function as arguments. The start date and the end date and whether it's done selecting passed to the callback as params. 

```
const datePicker = new DatePicker(Date, Callback)

const callback = (startDate, endDate, isDone)=>{/* do stuff */}
```

Set a specific month or year. Months are 0 index.

```
datePicker.setMonth(2)
datePick.setYear(2002)
datePicker.setDate(new Date())
```

Get the HTML layout, returns a HTMLDivElement representing the date picker.

```
datePicker.getLayout()
```

Reset the date picker to the current month and year by calling reset, or reset it to a specific date by passing a Date object to the params.
```
datePicker.reset()
datePicker.reset(newDate)
```

Use deSelect forget start and end date on the date picker.
```
datePicker.deSelect()
```

#### Picking a date

Click on a date on the picker to select it.

Click and drag across multiple boxes to select a range of dates.

Click on the month to select a specific month.

Click on the year to select a specific year.
Scroll to the desired year or just type it in on the input.

To make a selection across multiple months, use context menu to select the first date and then use either normal click or context menu to select the second date.

Reset selection by clicking on one of the highlighted selected dates.

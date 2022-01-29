# date-picker

# [Demo](https://seegg.github.io/date-picker)

### create a new Date Picker:


`const datePicker = new DatePicker(Date, Callback)`


The constructor accepts a Date object and a callback function as arguments. The start date and the end date selected from the date picker is passed to the callback. 

`const callback = (startDate, endDate)=>{/* do stuff */}`

Get the HTML layout:

`datePicker.getLayout()`

#### Picking a date

Click on a date on the picker to select it.

Click and drag across multiple boxes to select a range of dates.

To make a selection across multiple months, use context menu to select the first date and then use either normal click or context menu to select the second date.

reset selection by clicking on one of the selected dates.
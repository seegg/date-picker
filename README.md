# date-picker

# [Demo](https://seegg.github.io/date-picker)

### create a new Date Picker:

let datePicker = new DatePicker(Date, Callback)

The constructor accepts a Date object and a callback function as arguments. The start date and the end date selected from the date picker is passed to the callback. 

`const callback = (startDate, endDate)=>{/* do stuff */}`


#### Picking a date

Click on a date on the picker to select it.

Click and drag across multiple boxes to select a range of dates.

To make a selection ranging across multiple months, use the context menu to select the start date. Navigate the the desired month and or year and select the end date by either clicking or with the context menu again.
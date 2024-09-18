# tidy-date
A TypeScript library for omitting redundant parts when displaying dates and date ranges

With inspiration from [vercel/little-date](https://github.com/vercel/little-date). This library uses [Intl DateTimeFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and some utility functions from [formkit/tempo](https://github.com/formkit/tempo) for date comparison and timezone calculations. 


## Features
* Intl: Display the date in the User´s locale, with the parts in the correct order.
* Today: Use today's date to omit information such as the current year or day.
* Timezone: The date interval might works best in a specific timezone. 
* Display Resolution: Display dates down to the second or only just to the hour. 
* Date Resolution: The dates from the API might not be as detailed as down to the second.
* Boundary: Inclusive or exclusive end dates.


## How to use
```typescript
import {DateFormatter} from '@simonljus/tidy-date'

const fromDate = new Date("2024-08-05T00:00:00")
const toDate = new Date("2024-09-18T23:59:59")
const userLocale = getUserLocaleOrDefault("en-US") // TODO
const formatter = new DateFormatter();
const formattedRange = formatter.formatRange(fromDate,toDate,{locale: userLocale})
```

## Omitting parts
Some parts can be omitted when the value is the first or the last. For the following example, the timestamps are omitted since they are first of the day and last of the day. 

`2022-11-07T00:00:00 - 2024-10-04T23:59:59` -> `Nov 7, 2022 – Oct 4, 2024`s
>[!NOTE]  
When a time part has to be displayed for either start or end date, it has te be displayed for the other date as well. [Intl.DateTimeFormat.prototype.formatRangeToParts()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRangeToParts) could be used but found it difficult to know what literal to remove if the date part was removed. By using it, the order will still be preserved. Submit a PR! 

`2022-11-07T15:00:00 - 2024-10-04T23:59:59 ` -> `Nov 7, 2022, 3 PM – Oct 5, 2024, 12 AM`

## Range types

### Full years
`2024-01-01T00:00:00  - 2025-12-31T23:59:59`  -> `2024-2025`

### Full quarters
Quarters does not exist in Intl.DateTimeFormat. This means there is no localization support.
This is only used when `onlyIntl` is set to `false`

* `2024-04-01T00:00:00 - 2024-09-30T23:59:59` -> `Q2-Q3 2024`
* With the current year: -> `Q2–Q3`


### Full months
From the start of a month to the end of another:
* `2024-03-01T00:00:00 -  2024-05-31T23:59:59` -> `Mar – May 2024`
* With the current year -> `Mar – May`

* When the months span over different years
    * `2023-03-01T00:00:00 -  2024-05-31T23:59:59` -> `Mar – May 2024`



### Same Day 
Same year, month and day

`2024-04-01T13:37:00 - 2024-04-01T13:59:59` -> `Apr 1, 2024, 1:37 – 2:00 PM`
* With the current day -> `1:37 – 2:00 PM`
* With the current month (April in this example) -> `Apr 1, 1:37 – 2:00 PM`

### Same month
Same year and month, but not day
* `2024-01-01T00:00:00 - 2024-10-05T23:59:59` -> `Jan 1 – 5, 2024`
* With the current year -> `Jan 1 – 5`

### Same year
Dates with the same year
* `1 Jan 2024 - 5 Oct 2024` -> `Jan 1 – Oct 5, 2024`
* With the current year: -> `Jan 1 – Oct 5`

### Other cases
Could be any type of date range
* `5 Jan 2022 - 4 Oct 2024` -> `5 Jan 2022 - 4 Oct 2024`



## Inclusive and Exclusive date times in ranges.
Dates are displayed as inclusive and times are displayed as exclusive. 
### Examples 

National day of Sweden:

`2024-06-06T00:00:00 - 2024-06-07T00:00:00` -> `June 6 2024`

Working 9 to 5:

`2024-09-17T09:00:00 - 2024-09-17T16:59:59` -> `9 AM - 5 PM`


## Resolutions

### Date resolution
Sometimes the date information from the API might not be exact down to the second, such as Historical events. Sometimes, only the Year is known.
`1520-12-02T09:00:00 - 1521-03-04T00:00:00` with `dateResolution:'year'` Will be interpreted as  `1523` 


### Display resolution
Even if the API has date information down to the second, the user might not be interested in it. For example, only interested in the calendar day.
`2024-10-04:T10:00:00 - 2024-10-04:T22:00:00` with `displayResolution:'day'`   -> `Oct 4, 2024`




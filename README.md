# tidy-date
A TypeScript library for omitting redundant parts from dates and date ranges

With inspiration from [vercel/little-date](https://github.com/vercel/little-date). This library uses [Intl DateTimeFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and some utility functions from [formkit/tempo](https://github.com/formkit/tempo) for date comparison and timezone calculations. 


## Features
* Intl: Display the date in the User´s locale
* Timezone: The date interval might works best in a specific timezone. 
* Today: Use today's date to omit information (avoid displaying information like the current year or day)
* Display Resolution: Display dates down to the second or only just to the hour. 
* Date Resolution: The dates from the API might not be as detailed as down to the second.


## Omitting parts
Timestamps that starts on the start of the day and ends at the end of a day (or start of a day if exclusive ranges) will be omitted.

`2022-11-07T00:00:00.000 - 2024-10-04T23:59:59.999` -> `Nov 7, 2022 – Oct 4, 2024`s

When a time part has to be displayed for either start or end date, it has te be displayed for the other date as well. [Intl.DateTimeFormat.prototype.formatRangeToParts()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatRangeToParts) could be used but found it difficult to know what literal to remove if the date part was removed. Submit a PR! 
`7 Nov 2022 15:00:00 - 4 Oct 2024 23:59:59 ` -> `Nov 7, 2022, 3 PM – Oct 5, 2024, 12 AM`

## Range types

### Full years
`1 Jan 2024  - 31 Dec 2025`  -> `2024-2025`

### Full quarters
Quarters does not exist in Intl.DateTimeFormat. This means there is no localization support.
This is only used when `onlyIntl` is set to `false`

* `1 Apr 2024 - 30 Sep 2024` -> `Q1-Q3 2024`
* With the current year: -> `Q1-Q3`


### Full months
From the start of a month to the end of another:
* `1 Mar 2024 -  31 May 2024` -> `Mar - May 2024`

* When the months span over different years
    * `1 Mar 2023 -  31 May 2024` -> `Mar 2023 - May 2024`



### Same Day 
Same year, month and day
* `1 Apr 2024 13:37 - 1 Apr 2024 14:00` -> `1 Apr 2024 13:37-14:00`
* With the current day -> `13:37 - 14:00`

### Same month
Same year and month, but not day
* `1 Jan 2024 - 5 Jan 2024` -> `1-5 Jan 2024`
* With the current year -> `1-5 Jan`

### Same year
Dates with the same year
* `1 Jan 2024 - 5 Oct 2024` -> `1 Jan - 5 Oct 2024`
* With the current year: -> `1 Jan - 5 Oct`

### Other cases
Could be any type of date range
* `5 Jan 2022 - 4 Oct 2024` -> `5 Jan 2022 - 4 Oct 2024`



## Inclusive and Exclusive date times in ranges.
Dates are displayed as inclusive and times are displayed as exclusive. 
### Examples 

National day of sweden:
`June 6 YYYY 00:00:00 - June 7 YYYY 00:00:00` -> `June 6 YYYY`

Working 9 to 5 
`9:00 AM - 5:00 PM` -> `9 AM - 5 PM`


## Resolutions

### Date resolution
Sometimes the date information from the API might not be exact down to the second, such as Historical events. Sometimes, only the Year is known.

### Display resolution
Even if the API has date information down to the second, the user might not be interested in it. For example, only interested in the calendar day.





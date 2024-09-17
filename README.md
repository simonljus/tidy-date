# tidy-date
A TypeScript library for omitting redundant parts from dates and date ranges

With inspiration from [vercel/little-date](https://github.com/vercel/little-date). This library uses [Intl DateTimeFormat](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and some utility functions from [formkit/tempo](https://github.com/formkit/tempo) for date comparison and timezone calculations. 


## Features
* Intl: Display the date in the User´s locale
* Timezone: The date interval might works best in a specific timezone. 
* Today: Use today's date to omit information (avoid displaying information like the current year or day)
* Display Resolution: Display dates down to the second or only just to the hour. 
* Date Resolution: The dates from the API might not be as detailed as down to the second.

## Range types
### Full year

`1 Jan 2024  - 31 Dec 2025`  -> `2024-2025`

### Full month

`1 Jan 2024 - 5 Jan 2024` -> `1-5 Jan 2024`


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





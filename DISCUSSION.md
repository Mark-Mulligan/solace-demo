# Project Overview

I wanted to leave a few notes here to give some guidance on some of the features I chose to include in this project.

## Features

1.  Paginated search results
    This was implemented so the project can handle a larger data set.

2.  Debounced search
    This allows the user to type in the search input while the interface automatically submits the search.

3.  Search options recorded in the URL
    This allows the user to refresh the page and see the same results they previously searched for. This feature is also helpful for bookmarking so the user can save specific search results.

4.  Sortable columns in the table
    I added sorting functionality to the firstName, lastName, city, and yearsOfExperience columns in the table. The user can click on a column to sort ascending, and click again to sort in descending order.

5.  Responsive design
    Using Tailwind’s breakpoints, I made updates to adjust the table size on different screen sizes. Given more time, I could further optimize the layout across various devices.

## Future Ideas

Here are a few things I would do if given more time to improve this project:

1.  I would extract the specialties into another table. This would allow better search performance when filtering by specialties. I would also add a multi-select interface to allow users to filter by one or more specialties to refine their search.

2.  I would improve the pagination query on the backend. Right now, there are two queries: one to get the total results and another to get the paginated results. I would try to optimize this into a single, more performant query.

3.  I would add more UI features to handle loading states when searching or filtering the table. Right now, there is no noticeable delay because the data is small and everything is local. However, once deployed with a larger data set, there will be delays, so it would be useful to show the user when search results are loading.

4.  I would add TanStack Query on the frontend to help with loading states as well as caching search result data.

## Setup

You should be able to run the project by following the setup steps given in the README.md provided with the project. I used a local instance of postgres running in docker to power the backend as provided in the readme.

## Final Note

Thanks for taking the time to look over this. If you want to see something else I have been working on, check out [fluencyforge.com](https://www.fluencyforge.com/).

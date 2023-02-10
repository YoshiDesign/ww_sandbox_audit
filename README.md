# ww_sandbox_audit

*src/ww/* - dubdub.com/dubdub/ww/* Package

*src/ww_client/* - React App frontend

*src/server.go* - API entry points and static file server.

### Area of interest: Typeahead search recommendations

*src/ww/ww_utils/utils_Typeahead.go* - This is the typeahead system that is implemented at myworldworks.com. After selecting "United States of America"
from any of the country selectors, the *work* and *life* tabs will become accessible, each including a search-bar at the top of the page. Typing into
this search will generate recommendations.

*src/data_entry/* - Over the course of a year I acquired and scraped all of the data that is present in this app from numerous sources such as the
Bureau of Labor Statistics, the Census Bureau, WorldBank, etc. I did a lot of both manual and automated cleaning to be able to generate the data
structures that became the backbone of this app. The typeahead contains part of this effort's output. The scripts you'll find in the `data_entry/`
directory were used to build optimized trie structures from my curated data-sets, and use them to facilitate numerous actions as efficiently as possible. There is still room for optimization
determined by the strategies which have changed a couple of times throughout the course of this app's development.

# ww_sandbox_audit

Hello! This repository contains a large collection of files from my private repository for The World Works. The purpose of this repository is to allow clients and hiring entities to view my code, and get a glimpse of my programming practices.

*src/ww/* - dubdub.com/dubdub/ww/* Package

*src/ww_client/* - React App frontend

*src/server.go* - API entry points and static file server.

### Area of interest: Typeahead search recommendations

*src/ww/ww_utils/utils_Typeahead.go* - This is the typeahead system that is implemented at myworldworks.com. After selecting "United States of America"
from any of the country selectors, the *work* and *life* tabs will become accessible, each including a search-bar at the top of the page. Typing into
this search will generate recommendations.

*src/data_entry/* - Over the course of a year I acquired all of the data that is present in this app from numerous sources such as the
Bureau of Labor Statistics, the Census Bureau, WorldBank, and others. After cleaning the data I was able to create the data
structures that became the backbone of this app. The scripts you'll find in the `data_entry/`
directory were used to build optimized trie structures from my aggregates, used to facilitate numerous actions as efficiently as possible. There is still room for optimization as strategies continue to change throughout the course of development.

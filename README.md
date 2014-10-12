# remarkchart
-

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/rsteube/remarkchart.svg?branch=master)](https://travis-ci.org/rsteube/remarkchart)

Replaces tables in [remark] slideshows with charts from [Chart.js].

## Current state (WIP)
All six charts can be generated, but lots of stuff not yet working.

## How does it work?
Tables that shall be replaced by charts are tagged with css classes using [content-classes]. The content of the table is then read by remarkchart and replaced by the corresponding chart.

## Getting Started

### Extend the slideshow html
```html
<script src="Chart.js" type="text/javascript"></script>
<script src="jquery.js" type="text/javascript"></script>
<script src="remarkchart.js" type="text/javascript"></script>
```
```javascript
var slideshow = remark.create();
remarkchart.init(slideshow);
```

### Create a chart
To create a chart simply add `.chart-doughnut`, `chart-pie` or `.chart-polararea` to a table with legend text as headers and values in the first content row.
```
.chart-doughnut[
| One | Two | Three |
|-----|-----|-------|
| 1   | 2   | 3     |
]
```

It is also possible to explicitly set the colors by tagging the table headers. The defaults currently contain colors from the [tango color palette]. 
```
.chart-doughnut[
| .skyblue[One] | .plum[Two] | .aluminium[Three] |
|---------------|------------|-------------------|
| 1             | 2          | 3                 |
]
```


The `.chart-bar`, `.chart-line` and `.chart-radar` charts require an additional column that holds the labels. Each row represents one data set.
```
.chart-bar[
|   | One | Two | Three | Four | Five |
|---|-----|-----|-------|------|------|
| A | 1   | 2   | 3     | 4    | 5    |
| B | 2   | 3   | 4     | 5    | 6    |
| C | 3   | 4   | 5     | 6    | 7    |
| D | 4   | 5   | 6     | 7    | 8    |
]
```

Here the the elements in the first column need to be tagged to explicitly set the color.
```
.chart-bar[
|               | One | Two | Three | Four | Five |
|---------------|-----|-----|-------|------|------|
| .skyblue[A]   | 1   | 2   | 3     | 4    | 5    |
| .plum[B]      | 2   | 3   | 4     | 5    | 6    |
| .aluminium[C] | 3   | 4   | 5     | 6    | 7    |
| .chocolate[D] | 4   | 5   | 6     | 7    | 8    |
]
```

## Demo

### Install dependencies
```bash
npm install
```

### Build
```bash
grunt
```

### Open slideshow
Either open the `demo/demo.html` directly or start the web server with:

```bash
grunt connect
```

then open [http://localhost:8000/demo/demo.html]()

[content-classes]:https://github.com/gnab/remark/wiki/Markdown#content-classes
[remark]:https://github.com/gnab/remark
[Chart.js]:https://github.com/nnnick/Chart.js
[tango color palette]:http://tango.freedesktop.org/Tango_Icon_Theme_Guidelines
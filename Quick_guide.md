# zeeguu_learner_graph_module

zeeguu_learner_graph_module is a library based on the d3js to help to quickly make nice graphs on your page without a hassle.

# First step - setup

1) Include dependencies :
    
```
    <!--dependencies-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
```

2) Add distrubution version of zeeguu_learner_graph_module:
```
    <script type="text/javascript" src="DIST-zeeguu_learner_graph_module.js" charset="utf-8"></script>
```

# Second step - adding graphs

## Activity graph
### Input data format
Input json entry format should be :
> [{"date": "2016-05-28", "count": "123"}, {...}, ...]

### Call the function
```
    activity_graph(<input_data_var_name>, <element_to_draw_in>, <how_many_months_display>);
```

### Example
```
    // add next 2 lines anywhere you want display the graph (html)
    <zeeguu_graph id="activity_graph"></zeeguu_graph>
    <br/><br/><br/>
```
```
    // prepare the input_data (js)
    var activity_graph_input_data = [{"date": "2016-06-01", "count": "123"}, {"date": "2016-05-28", "count": "5"}];
    
    
    // call the function (js)
     activity_graph("activity_graph_input_data", "#activity_graph", 12);
```

![activity_graph](http://gdurl.com/cTmc)

----------------

## Line graph
### Input data format
Input json entry format for multiple months should be :
> [{"name": "Example", "amount": "123", "date": "Jan 2016"}, {"name": "Example", "amount": "52", "date": "Feb 2016"}, ...]

Input json entry format for the one month (~30 days) should be :
> [{"name": "Example", "amount": "123", "date": "1 Jan 2016"}, {"name": "Example", "amount": "52", "date": "2 Jan 2016"}, ...]

NB: Every month (if showing period of 5..12 months) or date (if showing period of 1 month) needs to have a entry (even if it is 0). 

### Call the function
```
    line_graph(<input_data_var_name>, <element_to_draw_in>, <how_many_months_display>);
```

NB: <how_many_months_display> is a parameter how many months to display in the graph (not including the current month). If number 6 is typed, then 7 months will actually be displayed.

 Displaying for the one year :   
```
    line_graph(<input_data_var_name>, <element_to_draw_in>);
    or
    line_graph(<input_data_var_name>, <element_to_draw_in>, 12);
```
 
 Displaying for the one month :  
```
    line_graph(<input_data_var_name>, <element_to_draw_in>, 1);
```

### Example 
Full example of 1 year period :
```
    // add this line anywhere you want display the graph (html)
    <zeeguu_graph id="line_graph"></zeeguu_graph>
```
```
    // prepare the input_data (js)
        var line_graph_input_data = [
        {"name": "Mathematics", "amount": "6", "date": "Apr 2016"}, {"name": "Mathematics", "amount": "6", "date": "May 2016"}, 
        {"name": "Mathematics", "amount": "7", "date": "Jun 2016"}, {"name": "Mathematics", "amount": "7", "date": "Jul 2016"}, 
        {"name": "Mathematics", "amount": "5", "date": "Aug 2016"}, {"name": "Mathematics", "amount": "6", "date": "Sep 2016"}, 
        {"name": "Mathematics", "amount": "7", "date": "Oct 2016"}, {"name": "Mathematics", "amount": "8", "date": "Nov 2016"}, 
        {"name": "Mathematics", "amount": "9", "date": "Dec 2016"}, {"name": "Mathematics", "amount": "8", "date": "Jan 2017"}, 
        {"name": "Mathematics", "amount": "7", "date": "Feb 2017"}, {"name": "Mathematics", "amount": "6", "date": "Mar 2017"}, 
        {"name": "History", "amount": "6", "date": "Apr 2016"}, {"name": "History", "amount": "7", "date": "May 2016"}, 
        {"name": "History", "amount": "8", "date": "Jun 2016"}, {"name": "History", "amount": "9", "date": "Jul 2016"},
        {"name": "History", "amount": "10", "date": "Aug 2016"}, {"name": "History", "amount": "8", "date": "Sep 2016"},
        {"name": "History", "amount": "9", "date": "Oct 2016"}, {"name": "History", "amount": "8", "date": "Nov 2016"},
        {"name": "History", "amount": "7", "date": "Dec 2016"}, {"name": "History", "amount": "6", "date": "Jan 2017"},
        {"name": "History", "amount": "5", "date": "Feb 2017"}, {"name": "History", "amount": "6", "date": "Mar 2017"}
    ];
    
     
    // call the function (js)
    line_graph("line_graph_input_data", "#line_graph", 12);
```

![line_graph](http://gdurl.com/avgr)

Full example of 1 month period :
```
    // add this line anywhere you want display the graph (html)
    <zeeguu_graph id="line_graph_month"></zeeguu_graph>
```
```
    // prepare the input_data (js)
    var line_graph_input_data_month = {...};
     
    // call the function (js)
    line_graph("line_graph_input_data_month", "#line_graph_month", 1);
```

![line_graph_month](http://gdurl.com/iJLd)

----------------

## Piechart graph
### Input data format
Input json entry format should be :
>[  {"label": "Example", "value": 10}, {"label": "Example1", "value": 10}, {"label": "Example2", "value": 10}, {"label": "Example3", "value": 10} ]

### Call the function
```
    piechart_graph(<input_data>, <element_to_draw_in>, <name>);
```

### Example
```
    // add next 2 lines anywhere you want display the graph
    <zeeguu_graph id="piechart_graph"></zeeguu_graph>
    <br/><br/><br/>
```
```
    // prepare the input_data
    piechart_graph_input_data = [
        {"label": "Example", "value": 111}, {"label": "Example1", "value": 111},
        {"label": "Example2", "value": 111}, {"label": "Example3", "value": 111}
    ];

    // call the function
    piechart_graph(piechart_graph_input_data, "#piechart_graph", "Test");
```

![piechart_graph](http://gdurl.com/OSsX)

----------------

# Third step - adding scalability for the activity graph and the line graph
## Adding realtime scalability for the activity graph and the line graph.  

1) Add auto_resize_feature.js to your page.
```
<script type="text/javascript" src="auto_resize_feature.js" charset="utf-8"></script>
```

2) Add attribute to your activity or line graph which you want to enable auto resize functionality.
```
<zeeguu_graph id="activity_graph" autoresize="true"></zeeguu_graph>
OR
<zeeguu_graph id="line_graph" autoresize="true"></zeeguu_graph>
```

autoresize = [true/false] : width of the graph will be adjusted based on the client screen width.

## Examples

1) Activity graph. By default can scale up to 3 months.

![activity_graph_small](http://gdurl.com/DoOK)

2) Line graph. By default can scale up to 5 months.

![line_graph_small](http://gdurl.com/ce3s)

3) Line graph for 1 month.

![line_graph_month_small](http://gdurl.com/DjAM)

NB: Default scale limits can be changed. For each graph, default limits are given based on how many months of the graph can fit on the mobile screen without scrolling.

----------------




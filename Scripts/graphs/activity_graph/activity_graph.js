// defined variables for activity graph

var cellSize = 20; // cell size
var width = 60 * cellSize;
var max_width = 1200;
var height = 9 * cellSize;

var months_in_year = 12;
var week_count_in_year = 53;
var day_count_in_week = 7;
var milliseconds_in_day = 1000 * 3600 * 24;

var year = new Date().getFullYear();
var month = new Date().getMonth();
var day = new Date().getDate();

var week_format = d3.time.format("%W");
var year_format = d3.time.format("%Y");
var date_format = d3.time.format("%Y-%m-%d");

var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var week_days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

var input_data;

// function convert_day_of_week_from_sun_to_mon
var convert_day_of_week_from_sun_to_mon = function (date) {
    return (date.getDay() + 6) % 7;
};

function week_number(date) {
    var result, week_count_in_displayed_interval;
    var days_in_month = 31;

    if ((year_format(date) - year + 1) == 0) {
        week_count_in_displayed_interval = week_format(new Date(year, month, day));
        result = ( cellSize * ( +week_format(date) - parseInt(week_count_in_displayed_interval) ) );
    } else {
        week_count_in_displayed_interval = week_format(new Date(year - 1, months_in_year - month - 1, days_in_month - day + 1));
        result = ( cellSize * ( +week_format(date) + parseInt(week_count_in_displayed_interval) - 1 ) );
    }

    return result;
}

function total_bookmarks_per_displayed_period() {
    var sum = 0;
    input_data.forEach(function (entry) {
        sum = sum + parseInt(entry.count);
    });
    return sum;
}

function compute_distance_between_dates_in_days(date1, date2) {
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (milliseconds_in_day));
    return diffDays;
}

function str_to_date(str) {
    var str_parts = str.split("-");

    var extracted_day = str_parts[2];
    var extracted_month = str_parts[1] - 1;
    var extracted_year = str_parts[0];

    return new Date(extracted_year, extracted_month, extracted_day);
}

function compare_dates_strings(dict1, dict2) {
    var date1 = new Date(str_to_date(dict1.date)).getTime();
    var date2 = new Date(str_to_date(dict2.date)).getTime();
    if (date1 < date2)
        return -1;
    else if (date1 > date2)
        return 1;
    else
        return 0;
}

function longest_streak() {
    var max = 0;
    var temp = 1; // temp is 1 ,as we need count the day itself which was compared to

    if (input_data.length > 0) { // check if array is not empty
        var prev_date = "0-0-0"; // initialize variable to keep track of previous iterations date

        input_data.forEach(function (entry) {
            if (compute_distance_between_dates_in_days(str_to_date(entry.date), str_to_date(prev_date)) <= 1) {
                temp++;
            } else {
                temp = 1;
            }
            max = Math.max(max, temp);
            prev_date = entry.date;
        });
    }

    return max;
}

function current_streak() {
    var streak = 0;
    var size = input_data.length;
    var today = new Date();

    // check if the last entry date is today/yesterday, if yes proceed counting else return
    for (var i = size - 1; i >= 0; i--) {
        var last_entry_date = input_data[i].date;
        if (compute_distance_between_dates_in_days(today, str_to_date(last_entry_date)) <= 1) {
            today = str_to_date(last_entry_date);
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function day_or_days(num) {
    if (num == 1) {
        return " day";
    } else {
        return " days";
    }
}

function draw_activity_graph(input_data_a, appendTo, months_to_show) {

    if (isNaN(months_to_show)) {
        var months_to_show = 12;
    }

    // needed offset for calculating right positions for draw elements
    var months_offset = 12 - months_to_show;
    // recalculating width + 55px offset for error
    width = months_to_show * 5 * cellSize + 55;


    input_data = input_data_a;

    // function which returns the style class for the color tone, depending on what is the count of the bookmarks
    // more bookmarks -> more darker tone
    var number_of_intervals = 5;
    var color_getter = d3.scale.quantize()
        .domain([0, 60])
        .range(d3.range(number_of_intervals).map(function (index) {
            return "q" + index + "-5";
        }));

    var graph_table_x = (max_width - cellSize * week_count_in_year) / 2; //edited
    var graph_table_y = height - cellSize * day_count_in_week - 1;

    var activity_graph = d3.select(appendTo).selectAll("svg")
        .data(d3.range(year, year + 1))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + graph_table_x + "," + graph_table_y + ")");

    var starting_date = new Date(year-1 , month + months_offset, day + 1);
    var week_offset = week_number(starting_date);

    var day_rectangles = activity_graph.selectAll(".day")
        .data(function (year) {
            // time period of squares
            // new Date(year-1 , month, day + 1)
            return d3.time.days(starting_date, new Date(year, month, day + 1));
        })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (date) {
            return week_number(date) - week_offset; // edited
        })
        .attr("y", function (date) {
            return convert_day_of_week_from_sun_to_mon(date) * cellSize;
        })
        .datum(date_format);

    // adding default tooltip for empty day_rectangles
    day_rectangles.append("title")
        .text(function (date) {
            return "0 translations on " + date;
        });

    // text adding

    // adding month names to the graph
    for (var index = 0 + months_offset; index < months_in_year; index++) { // edited
        var temp_year = year;
        var temp_month = month;
        var left_offset_of_matrix = 45;

        // calculating on top of which day should be printed month name
        if (day < 10) temp_month--; // on which side of the table to print month name if the month divided in half
        if (index + temp_month < months_in_year - 1) temp_year = temp_year - 1; // which year to add to the month name
        temp_month = (index + temp_month + 1) % months_in_year; // calculating correct index of the month name in the month_names array

        activity_graph.append("text")
            .attr("transform", "translate(" + (week_number(new Date(temp_year, temp_month, 4)) - week_offset + left_offset_of_matrix) + ",0)") // edited
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(month_names[temp_month] + " " + temp_year);
    }

    // adding day names to the graph
    for (index = 0; index < day_count_in_week; index++) {
        activity_graph.append("text")
            .attr("transform", "translate(-8," + cellSize * (index + 1) + ")")
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(week_days[index]);
    }

    // end of text adding

    var nested_input_data = d3.nest()
        .key(function (entry) {
            return entry.date;
        })
        .rollup(function (entry) {
            return entry[0].count;
        })
        .map(input_data);

    // editing tooltip for filled day_rectangles
    day_rectangles.filter(
        function (date) {
            return date in nested_input_data;
        })
        .attr("class", function (index) {
            return "day " + color_getter(nested_input_data[index]);
        })
        .select("title")
        .text(function (date) {
            return nested_input_data[date] + " translations on " + date;
        });

    input_data.sort(compare_dates_strings); // sort array based on the dates

    var html = "<br/><br/><br/>";
    html += '<div class="row" style="width: 850px;height: 80px; padding: 0px 50px;">';
    html += '<div class="col-xs-4 col-md-4">';
    html += "<h4>Translations in this period</h4> <h3>" + total_bookmarks_per_displayed_period() + " Total" + "</h3>";
    html += "</div>";

    html += '<div class="col-xs-4 col-md-4" style="padding-left: 40px;"> <h4>Longest streak</h4>';
    var longest_streak_res = longest_streak();
    html += "<h3>" + longest_streak_res + day_or_days(longest_streak_res) + "</h3>";
    html += "</div>";

    html += '<div class="col-xs-4 col-md-4" style="padding-left: 30px;"> <h4>Current streak</h4>';
    var current_streak_res = current_streak();
    html += "<h3>" + current_streak_res + day_or_days(current_streak_res) + "</h3>";
    html += "</div>";

    html += "</div>";

    $(html).appendTo( document.getElementById(appendTo.substring(1)) );

}

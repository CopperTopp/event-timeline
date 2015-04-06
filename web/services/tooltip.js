angular.module('relcalApp')
.service('tooltip', [function() {
  this.template = [];
  this.tooltip;
  this.click_hold = false;
  this.show_state = false;
  
  this.initialize = function(template) {
    this.template = template;
    this.tooltip = d3.select("div.tl_tooltip");
    var tt_table = this.tooltip.append("table");
    var tt_rows = tt_table.selectAll("tr")
            .data(this.template)
            .enter()
            .append("tr")
            .attr("class", function(d) {
              return 'tt-row-' + d.name;
            });
    var tt_columns = tt_rows.selectAll("td")
            .data(function(row) {
              return [
                {
                  name: 'name',
                  value: row.name,
                  class: 'tt-col tt-col-name tt-col-name-' + row.name
                },
                {
                  name: 'val',
                  value: 'undefined',
                  class: 'tt-col tt-col-val tt-col-val-' + row.name
                }
              ]
            })
            .enter()
            .append("td")
            .text(function(d) {
              return d.value;
            })
            .attr("class", function(d) {
              return d.class;
            });
  };
  
  this.get_html = function(item, event) {
    var v = "undefined";
    switch(item.type) {
      case 'line':
        try {
          eval('v = ' + item.value + ';');
        } catch (e) {
          console.log(e.message);
          console.log(e.stack);
        }
        break;
      case 'date_range':
        try {
          eval('var sd = new Date(' + item.start + ');');
          eval('var ed = new Date(' + item.end + ');');
        } catch(e) {
          console.log(e.message);
          console.log(e.stack);
        }
        if (sd && ed) {
          var format = d3.time.format(item.d3_format);
          var st = format(sd);
          var et = format(ed);
          v = st + " - " + et;
          if (item.timezone_label) v += " " + item.timezone_label;
        }
        break;
      case 'link':
        try {
          eval('var link = ' + item.value + ';');
          eval('var token = ' + item.token + ';');
        } catch (e) {
          console.log(e.message);
          console.log(e.stack);
        }
        if (item.href) {
          v = "<a href='" +
              item.href.replace(/#TOKEN#/g, token) +
              "' target='_blank'>" +
              link + "</a>";
        } else {
          v = "<a onclick=\"" +
              item.click.replace(/#TOKEN#/g, token) +
              "\" href='javascript:void(0);'>" +
              link + "</a>";
        }
        break;
      default:
        break;
    }
    return v;
  };
  
  this.update = function(event, x, y) {
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    var get_html = this.get_html;
    this.template.forEach(function(line) {
      d3.select("td.tt-col-val-" + line.name)
        .data(function(d) {
          var r = get_html(line, event.event);
          return [r];
        })
        .html(function(d) { return d; });
    });
    this.tooltip
      .style({
          "left": x + "px",
          "top": y + "px",
          "width": "auto",
          "height": "auto"
        });
  };

  this.hide = function() {
  };
  
  this.show_passing = function(event, x, y) {
    if (!this.click_hold) {
      this.update(event, x, y);
      this.show_state = true;
    }    
  };
  
  this.hide_passing = function() {
    if (!this.click_hold) {
      this.show_state = false;
    }
  };

  this.show_hold = function(event, x, y) {
    this.update(event, x, y);
    this.show_state = true;
    this.click_hold = true;
  }
  
  this.hide_hold = function() {
    this.click_hold = false;
    this.show_state = false;
  }
  
  this.get_show = function() {
    return this.show_state;
  }
  
  this.get_template = function() {
    return this.template;
  };
}]);
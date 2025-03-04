<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {Stores_Dashboard} from "@/stores/dashboard/dashboard.js";
export default {
  name: "Dashboard_System_Colors",
  data() {
    return {
      from_colors:[],
      to_colors:[],
      root: null, // برای مدیریت ریشه amcharts
      chart_to : null
    }
  },
  mounted() {
    this.Get_Items();
  },
  beforeDestroy() {
    if (this.root) {
      this.root.dispose();
    }
    if (this.chart_to) {
      this.chart_to.dispose();
    }
  },
  methods: {
    Get_Items(){
      Stores_Dashboard().System_Colors().then(res=>{
        if (res.data.result.from_colors){
          res.data.result.from_colors.forEach(item=>{
            this.from_colors.push({
              country: item.name,
              value: Number(item.current_choices),
            })
          })
          console.log(this.from_colors);
          this.renderChart();
        }
        if (res.data.result.to_colors){
          res.data.result.to_colors.forEach(item=>{
            this.to_colors.push({
              country: item.name,
              value: Number(item.convert_choices),
            })
          })
          this.renderChartTo();
        }
      }).catch(error=>{

      })
    },
    renderChart() {
      if (this.root) {
        this.root.dispose(); // اگر نمودار قبلاً وجود دارد، حذف شود.
      }
      let root = am5.Root.new(this.$refs.chartdiv);

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft:0,
        paddingRight:1
      }));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
      cursor.lineY.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      xRenderer.grid.template.setAll({
        location: 1
      })

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "country",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      }));

      let yRenderer = am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer
      }));

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "country",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      }));

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
      series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });


// Set data
      let data = this.from_colors;

      xAxis.data.setAll(data);
      series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);
      this.root = root
    },
    renderChartTo() {
      if (this.chart_to) {
        this.chart_to.dispose(); // اگر نمودار قبلاً وجود دارد، حذف شود.
      }
      let chart_to = am5.Root.new(this.$refs.chartdivto);

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
      chart_to.setThemes([
        am5themes_Animated.new(chart_to)
      ]);

// Create chart
// https://www.amcharts.com/docs/v5/charts/xy-chart/
      let chart = chart_to.container.children.push(am5xy.XYChart.new(chart_to, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft:0,
        paddingRight:1
      }));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      let cursor = chart.set("cursor", am5xy.XYCursor.new(chart_to, {}));
      cursor.lineY.set("visible", false);


// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      let xRenderer = am5xy.AxisRendererX.new(chart_to, {
        minGridDistance: 30,
        minorGridEnabled: true
      });

      xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
      });

      xRenderer.grid.template.setAll({
        location: 1
      })

      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_to, {
        maxDeviation: 0.3,
        categoryField: "country",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_to, {})
      }));

      let yRenderer = am5xy.AxisRendererY.new(chart_to, {
        strokeOpacity: 0.1
      })

      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_to, {
        maxDeviation: 0.3,
        renderer: yRenderer
      }));

// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      let series = chart.series.push(am5xy.ColumnSeries.new(chart_to, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "country",
        tooltip: am5.Tooltip.new(chart_to, {
          labelText: "{valueY}"
        })
      }));

      series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
      series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });


// Set data
      let data = this.to_colors;

      xAxis.data.setAll(data);
      series.data.setAll(data);


// Make stuff animate on load
// https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);
      this.chart_to = chart_to
    },
  }
}
</script>

<template>
  <q-card flat>
    <q-card-section>
      <div class="row">
        <div class="col-md-6 col-lg-6 q-px-sm">
          <div class="q-mb-lg">
            <strong class="text-red">بیشترین رنگ های فعلی </strong>
          </div>
          <div dir="ltr" class="chart-class" ref="chartdiv"></div>
        </div>
        <div class="col-md-6 col-lg-6 q-px-sm">
          <div class="q-mb-lg">
            <strong class="text-red">بیشترین رنگ های انتخابی </strong>
          </div>
          <div dir="ltr" class="chart-class" ref="chartdivto"></div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.chart-class {
  width: 100%;
  height: 400px;
}
</style>
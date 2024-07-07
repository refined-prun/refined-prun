import { DefaultColors } from './Style';
import { AxisType, Data, Layout, newPlot } from 'plotly.js-dist-min';

/*export function generateTestGraph()
{
	
	const plotTester = document.createElement('div');
	const data = [{
		x: ["2007-01-01", "2007-02-01","2007-02-20","2007-03-01","2007-05-01"],
		y: [1e6, 1.5e6, 3.5e6, 4.0124e6, 9e6],
		line: {color: '#f7a600'},
		mode: "lines"
		}];
	const layout = { 
		margin: {t: 20, b:20, l:40, r:20}, plot_bgcolor: "rgba(0,0,0,0)", paper_bgcolor: "rgba(0,0,0,0)", hovermode: "closest", dragmode: "pan",
			xaxis: {type: "date", gridcolor: "#505050", tickfont: {color: "#999"}, tickformat: "%m/%d"},
			yaxis: {gridcolor: "#505050", tickfont: {color: "#999"}, tickprefix: "₳"}}
	Plotly.newPlot( plotTester, data, layout, {displayModeBar: false, scrollZoom: true});
		
	return plotTester;
}*/

export function generateLineGraph(
  xdata,
  ydata,
  xlabel,
  ylabel,
  plotWidth,
  plotHeight,
  xtype: AxisType = '-',
  ytype: AxisType = '-',
  xprefix = '',
  yprefix = '',
  xformat = '',
  yformat = '',
) {
  const graph = document.createElement('div');
  const data = [{ x: xdata, y: ydata, line: { color: '#f7a600' }, mode: 'lines' }];

  const layout: Partial<Layout> = {
    margin: { t: 10, b: 40, l: 80, r: 10 },
    width: plotWidth,
    height: plotHeight,
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    dragmode: 'pan',
    xaxis: {
      type: xtype,
      gridcolor: '#505050',
      tickfont: { color: '#999' },
      tickformat: xformat == '' ? undefined : xformat,
      tickprefix: xprefix,
      title: { text: xlabel, font: { family: '"Droid Sans", sans-serif', color: 'rgb(238, 238, 238)' } },
    },
    yaxis: {
      type: ytype,
      gridcolor: '#505050',
      tickfont: { color: '#999' },
      tickformat: yformat == '' ? undefined : yformat,
      tickprefix: yprefix,
      title: { text: ylabel, font: { family: '"Droid Sans", sans-serif', color: 'rgb(238, 238, 238)' } },
    },
  };

  newPlot(graph, data, layout, { displayModeBar: false, scrollZoom: true });

  return graph;
}

export function generatePieChart(labelData, numericalData, plotWidth, plotHeight) {
  let i;
  let colorScheme = DefaultColors;
  for (i = 0; i < labelData.length / 8; i++) {
    colorScheme = colorScheme.concat(DefaultColors);
  }

  for (i = 20; i < labelData.length; i++) {
    labelData[i] = 'Other';
  }

  const graph = document.createElement('div');
  const data: Data[] = [
    {
      values: numericalData,
      labels: labelData,
      type: 'pie',
      hoverinfo: 'label+percent',
      textinfo: 'label',
      marker: { colors: colorScheme },
      insidetextorientation: 'horizontal',
      // @ts-expect-error typing errors
      textfont: { color: '#cccccc' },
      automargin: true,
      sort: false,
    },
  ];

  const layout = {
    margin: { t: 10, b: 10, l: 10, r: 10 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    height: plotHeight,
    width: plotWidth,
    showlegend: false,
  };

  newPlot(graph, data, layout, { displayModeBar: false, scrollZoom: false });

  return graph;
}

// Place for back up functions that return nothing to cut out plotly to speed up packing
/*
export function generateLineGraph(xdata, ydata, xlabel, ylabel, plotWidth, plotHeight, xtype = "", ytype = "", xprefix = "", yprefix = "", xformat = "", yformat = "")
{
	const x=xdata+ydata+xlabel+ylabel+plotWidth+plotHeight+xtype+ytype+xprefix+yprefix+xformat+yformat;
	const returner = document.createElement("div");
	returner.textContent = x;
	return returner;
}
*/

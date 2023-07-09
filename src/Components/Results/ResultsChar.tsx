import { FC } from "react";
import { ChartType, PollChartData } from "../../types";
import { Pie, Bar } from "react-chartjs-2";
// Aqui hemos importado la libreria que ayuda imprimir los LABELS en las GRAFICAS
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Chart } from "chart.js";
// Aqui debemos REGISTRAR el PLUGIN
Chart.register(ChartDataLabels)

interface ResultsChartProps {
  chartData: PollChartData,
  chartType: ChartType
}

const datalabels = {
  color: '#fff',
  font: {
    size: 16
  },
  formatter: (value: number, context: any) => {
    const data = context.chart.data;
    // reduce() -> ayuda a realizar suma de un arreglo de datos
    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
    console.log(total);
    return Math.round((100 / total) * value) + "%";
  }
}

const pieOptions = {
  plugins: {
    datalabels
  }
}

const barOptions= {
  scales: {
    y: {
      ticks: {
        precision: 0
      }
    }
  },
  plugins: {
    datalabels: { ...datalabels, font: { size: 13 } },
    legend: {
      display: false
    }
  }
}

const ResultsChart:FC<ResultsChartProps> = ({ chartData, chartType }) => {
  return (
    <div className="mb-5">
      <div className="chart-container">
        <h6>{ chartData.title }</h6>
        {
          chartType === "PIE" ? <Pie options={pieOptions} data={chartData.data}></Pie> 
          : <Bar options={barOptions} data={chartData.data}></Bar>
        }
      </div>
    </div>
  )
}

export default ResultsChart;
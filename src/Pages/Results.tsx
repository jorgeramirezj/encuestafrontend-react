import { FC, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { getPollResults } from "../_services/PollService";
import { ChartType, PollResult } from "../types";
import { PollChartData } from '../types/index';
import { Col, Container, Form, Row } from "react-bootstrap";
import ResultsChart from "../Components/Results/ResultsChar";
// Esta libreria es solo JS y no tiene TypeScript
import palette from 'google-palette';

interface RouteParams {
  id: string
}

interface ResultsProps extends RouteComponentProps<RouteParams>{

}

const Results:FC<ResultsProps> = (props) => {
  
  const pollId = props.match.params.id;

  // Seteamos nuestros datos de grafico en una PIEZA DE ESTADO
  const [chartData, setChartData] = useState<PollChartData[]>([]);
  const [pollTitle, setPollTitle] = useState("");

  // Pieza de Estado para el TIPO de GRAFICA
  const [chartType, setChartType] = useState<ChartType>("PIE");

  // Esto ayuda a redireccionar
  const history = useHistory();

  useEffect(() => {
    fetchResults();
  },[])

  const fetchResults = async () => {
    try {
      const res: any = await getPollResults(pollId);
      const results: PollResult[] = res.data.results;
      formatData(results);
      setPollTitle(res.data.content);
      console.log(results);
    } catch(error){
      history.replace('/');
    }
  }

  const renderResultsChart = () => {
    return chartData.map(data => 
      <ResultsChart chartData={data} chartType={chartType} key={data.questionId}></ResultsChart>
    );
  }

  // Formateo de datos para enviar a ChartJS
  const formatData = (results: PollResult[]) => {
    const pollChartData: PollChartData[] = [];

    for(let key in results){
      let chartData: any = {
        data: {
          labels: [],
          datasets: [{
            data: []
          }]
        },
        title: results[key].question,
        questionId: key
      }
      results[key].details.forEach(detail => {
        chartData.data.labels?.push(detail.answer);
        chartData.data.datasets[0].data.push(detail.result);
      });
      chartData.data.datasets[0].backgroundColor = palette('cb-Set2', results[key].details.length).map((color: any) => '#' + color);
      pollChartData.push(chartData);
    }
    setChartData(pollChartData);
  }


  return (
    <Container>
      <Row>
        <Col lg="6" md="10" sm="10" className="mx-auto mt-5">
          <div className="header">
            <h4>{pollTitle}</h4><hr/>
            <div className="mb-3">
              <Form.Check
                inline
                label="Gráfico de tortas"
                name="chart"
                type="radio"
                id="chart-pie"
                checked={chartType === "PIE"}
                onChange={(e) => setChartType("PIE")}
              />
              <Form.Check
                inline
                label="Gráfico de barras"
                name="chart"
                type="radio"
                id="chart-bar"
                checked={chartType === "BAR"}
                onChange={(e) => setChartType("BAR")}
              />
            </div>
          </div>
          { renderResultsChart() }
        </Col>
      </Row>
    </Container>
  )
}

export default Results;
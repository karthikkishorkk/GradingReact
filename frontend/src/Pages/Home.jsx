import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8085/top-teachers')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const chartData = {
    labels: data.map(t => t.teacher_name),
    datasets: [
      {
        label: 'Points',
        data: data.map(t => t.points),
        backgroundColor: data.map(t =>
          t.points > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(200, 200, 200, 0.4)'
        ),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top 10 Teachers by Points',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Points: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10
        }
      }
    }
  };

  return (
    <div style={{ width: '80%', margin: '2rem auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Home;

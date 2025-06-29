import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

//const backend = 'http://localhost:3001';

//const backend = 'http://backend:3001'; // "backend" is the name of the backend service in docker-compose

const backend = process.env.REACT_APP_BACKEND || 'http://localhost:3001';

function App() {
  const userId = 1;
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get(`${backend}/expenses/${userId}`).then(res => setExpenses(res.data));
  }, []);

  //useEffect(() => {
    // axios.get(`${backend}/expenses/1`)
     //.then(res => console.log(res.data))
     //.catch(err => console.error('AXIOS ERROR', err));
  //}, []);


  const grouped = expenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(grouped),
    datasets: [{
      label: 'Monthly Expenses',
      data: Object.values(grouped),
      backgroundColor: 'rgba(75,192,192,0.6)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1
    }]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Expense Tracker</h1>
      <Bar data={data} />
      <h2>Expenses</h2>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.date} — <strong>{exp.category}</strong>: ₹{exp.amount} ({exp.description})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


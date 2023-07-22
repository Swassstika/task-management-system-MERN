import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const Dashboard = ({ apiUrl }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    // D3.js code to visualize tasks on the dashboard
    // ...

    // Example: Create a simple bar chart to show the number of tasks for each user
    const data = d3.group(tasks, (d) => d.assignedUser._id);
    const users = data.map(([userId, tasks]) => ({
      userId,
      tasksCount: tasks.length,
    }));

    const svg = d3.select('#dashboard-chart');
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(users.map((d) => d.userId))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(users, (d) => d.tasksCount)])
      .nice()
      .range([height, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(users)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.userId))
      .attr('y', (d) => y(d.tasksCount))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.tasksCount));

    return () => {
      // Clean up D3.js code if necessary
      // ...
    };
  }, [tasks]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div id="dashboard-chart"></div>
    </div>
  );
};

export default Dashboard;

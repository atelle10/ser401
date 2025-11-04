import { useState } from 'react';

// basic data table for fire/medical incidents
const FireMedicalDataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!data || data.length === 0) {
    return <p>No incident data to display</p>;
  }

  const headers = Object.keys(data[0]);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="data-table-container">
      <table>
        <thead>
          <tr>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, i) => (
            <tr key={i}>
              {headers.map(h => <td key={h}>{row[h]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <p>Page {currentPage}</p>
    </div>
  );
};

export default FireMedicalDataTable;

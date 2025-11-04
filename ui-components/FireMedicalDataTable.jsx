import { useState, useMemo } from 'react';

const FireMedicalDataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 15;

  if (!data || data.length === 0) {
    return (
      <div className="border rounded p-8 text-center text-gray-500">
        <p>No incident data uploaded yet</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  
  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (searchTerm) {
      filtered = data.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [data, searchTerm, sortField, sortDir]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="border rounded bg-white">
      <div className="p-4 border-b">
        <input 
          type="text"
          placeholder="Search incidents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded w-full max-w-md"
        />
        <p className="text-sm text-gray-600 mt-2">
          Showing {startIdx + 1}-{Math.min(startIdx + rowsPerPage, filteredData.length)} of {filteredData.length} incidents
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {headers.map(h => (
                <th 
                  key={h} 
                  className="text-left p-3 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(h)}
                >
                  {h}
                  {sortField === h && (
                    <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                {headers.map(h => (
                  <td key={h} className="p-3">{row[h]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 border-t flex justify-between items-center">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FireMedicalDataTable;

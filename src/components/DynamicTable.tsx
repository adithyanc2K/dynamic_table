import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, toggleColumn, setRows, addColumn } from '../store/store';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TextField,
} from '@mui/material';
import Papa from 'papaparse';

import { saveAs } from 'file-saver';

export default function DynamicTable() {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.table.rows);
  const columns = useSelector((state: RootState) => state.table.columns);
  const [search, setSearch] = useState('');

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        dispatch(setRows(results.data));
      },
    });
  };

  const handleExport = () => {
    const visibleColumns = columns.filter(c => c.visible).map(c => c.key);
    const data = rows.map(row => {
      const obj: any = {};
      visibleColumns.forEach(key => (obj[key] = row[key]));
      return obj;
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table-data.csv');
  };

  const filteredRows = rows.filter(row =>
    columns.some(c => row[c.key]?.toString().toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input type="file" accept=".csv" onChange={handleImport} style={{ marginLeft: '10px' }} />
        <Button variant="contained" onClick={handleExport} style={{ marginLeft: '10px' }}>
          Export CSV
        </Button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        {columns.map(col => (
          <label key={col.key} style={{ marginRight: '10px' }}>
            <Checkbox
              checked={col.visible}
              onChange={() => dispatch(toggleColumn(col.key))}
            />
            {col.label}
          </label>
        ))}
        <Button
          onClick={() => {
            const newKey = prompt('Enter column key') || 'new';
            const newLabel = prompt('Enter column label') || 'New Column';
            dispatch(addColumn({ key: newKey, label: newLabel }));
          }}
        >
          Add Column
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.filter(c => c.visible).map(c => (
                <TableCell key={c.key}>{c.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow key={idx}>
                {columns.filter(c => c.visible).map(c => (
                  <TableCell key={c.key}>{row[c.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

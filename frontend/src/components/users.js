import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  IconButton,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Initial data
const initialData = [
  { name: 'Athena Weissnat', email: 'Elouise.Prohaska@yahoo.com', phone: '123-456-7890', status: 'Active' },
  { name: 'Deangelo Runolfsson', email: 'Kadin_Trantow87@yahoo.com', phone: '234-567-8901', status: 'Inactive' },
  { name: 'Danny Carter', email: 'Marina3@hotmail.com', phone: '345-678-9012', status: 'Active' },
  { name: 'Trace Tremblay PhD', email: 'Antonina.Pouros@yahoo.com', phone: '456-789-0123', status: 'Inactive' },
  { name: 'Derek Dibbert', email: 'Abagail29@hotmail.com', phone: '567-890-1234', status: 'Active' },
  { name: 'Viola Bernhard', email: 'Jamie23@hotmail.com', phone: '678-901-2345', status: 'Inactive' },
  { name: 'Austin Jacobi', email: 'Genesis42@yahoo.com', phone: '789-012-3456', status: 'Active' },
];

const statusStyles = {
    Active: {
      backgroundColor: '#d4edda', 
      color: '#155724', 
      display: 'inline-block', 
      padding: '0px 10px', 
      borderRadius: '4px',
      whiteSpace: 'nowrap', // Prevent wrapping
      marginTop: '8px', // Match top margin
      marginBottom: '8px', // Match bottom margin
    },
    Inactive: {
      backgroundColor: '#f8d7da', 
      color: '#721c24', 
      display: 'inline-block', 
      padding: '2px 10px', 
      borderRadius: '4px',
      whiteSpace: 'nowrap', // Prevent wrapping
      marginTop: '8px', // Match top margin
      marginBottom: '8px', // Match bottom margin
    },
  };

const Users = ({ data = initialData, width = '100%', maxHeight = '400px' }) => {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    sortData(field, reversed, search);
  };

  const sortData = (sortBy, reversed, search) => {
    let filteredData = filterData(data, search);

    if (sortBy) {
      filteredData.sort((a, b) => {
        if (reversed) {
          return b[sortBy].localeCompare(a[sortBy]);
        }
        return a[sortBy].localeCompare(b[sortBy]);
      });
    }

    setSortedData(filteredData);
  };

  const filterData = (data, search) => {
    const query = search.toLowerCase().trim();
    return data.filter(item =>
      Object.keys(item).some(key => item[key].toLowerCase().includes(query))
    );
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    sortData(sortBy, reverseSortDirection, value);
  };

  return (
    <Paper sx={{ width, margin: 'auto', padding: 4, mt:1, boxShadow: 'none' }} elevation={0}>
      <TextField
        placeholder="Search..."
        variant="outlined"
        margin="normal"
        InputProps={{
          startAdornment: (
            <IconButton sx={{ padding: 0.5 }}>
              <SearchIcon />
            </IconButton>
          ),
          sx: { height: '35px', width: '300px', mt:-5},
        }}
        sx={{ height: '30px', marginBottom: -3 }} // Reduced height
        value={search}
        onChange={handleSearchChange}
      />
      <TableContainer sx={{ maxHeight }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#F5F7F9' }}>
            <TableRow>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize:'0.75rem', fontWeight:'bold' }}>SN</TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize:'0.75rem', fontWeight:'bold' }}>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1 , fontSize:'0.75rem', fontWeight:'bold'}}>
                <TableSortLabel
                  active={sortBy === 'email'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize:'0.75rem', fontWeight:'bold' }}>Phone</TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1 , fontSize:'0.75rem', fontWeight:'bold'}}>
                <TableSortLabel
                  active={sortBy === 'status'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize:'0.75rem', fontWeight:'bold'  }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell align="left" sx={{ padding: 1, fontSize:'0.70rem'}}>{index + 1}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize:'0.70rem' }}>{row.name}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize:'0.70rem' }}>{row.email}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize:'0.70rem' }}>{row.phone}</TableCell>
                  <TableCell align="left" sx={statusStyles[row.status]}>
                    {row.status}
                  </TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize:'0.70rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color:'blue' }}>
                      View <ArrowForwardIcon sx={{ marginLeft: 0.5, fontSize: '16px' }} />
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nothing found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Users;

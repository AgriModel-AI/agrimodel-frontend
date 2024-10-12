import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Initial data
const initialData = [
  { name: 'Farmer Community', numberOfMembers: '100', numberOfPosts: '12023', createdDate: '2023-10-01' },
  { name: 'Farmer Community', numberOfMembers: '100', numberOfPosts: '546', createdDate: '2023-09-15' },
  { name: 'Farmer Community', numberOfMembers: '100', numberOfPosts: '345', createdDate: '2023-08-22' },
  { name: 'Farmer Community', numberOfMembers: '100', numberOfPosts: '456', createdDate: '2023-07-30' },
];

const Community = ({ data = initialData, width = '100%', maxHeight = '400px' }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [search, setSearch] = useState('');

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    sortData(field, reversed);
  };

  const sortData = (sortBy, reversed) => {
    const sorted = [...data].sort((a, b) => {
      if (sortBy === 'createdDate') {
        return reversed
          ? new Date(b[sortBy]) - new Date(a[sortBy])
          : new Date(a[sortBy]) - new Date(b[sortBy]);
      }
      if (sortBy === 'numberOfPosts') {
        return reversed
          ? b[sortBy] - a[sortBy]
          : a[sortBy] - b[sortBy];
      }
      return reversed
        ? b[sortBy].localeCompare(a[sortBy])
        : a[sortBy].localeCompare(b[sortBy]);
    });
    setSortedData(sorted);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
    const filteredData = data.filter(item =>
      Object.keys(item).some(key =>
        item[key].toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setSortedData(filteredData);
  };

  return (
    <Paper sx={{ width, margin: 'auto', padding: 4, mt: 1, boxShadow: 'none' }} elevation={0}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'green',
          '&:hover': {
            backgroundColor: 'darkgreen',
          },
          mt: -5,
          padding: '4px 12px', // Adjust padding for height and width
          textTransform: 'none', // Prevent text from being transformed to uppercase
          alignItems: 'center', // Center the icon and text vertically
        }}
      >
        <AddIcon sx={{ marginRight: '8px' }} />
        Create new community
      </Button>
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
          sx: { height: '35px', width: '300px', mt: -5, ml: 6 },
        }}
        value={search}
        onChange={handleSearchChange}
      />
      
      <TableContainer sx={{ maxHeight }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#F5F7F9' }}>
            <TableRow>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>SN</TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('name')}
                >
                  Community
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'numberOfMembers'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('numberOfMembers')}
                >
                  Number of Members
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'numberOfPosts'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('numberOfPosts')}
                >
                  Number of Posts
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={sortBy === 'createdDate'}
                  direction={reverseSortDirection ? 'desc' : 'asc'}
                  onClick={() => setSorting('createdDate')}
                >
                  Created Date
                </TableSortLabel>
              </TableCell>
              <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{index + 1}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.name}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.numberOfMembers}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.numberOfPosts}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.createdDate}</TableCell>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'blue' }}>
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

export default Community;

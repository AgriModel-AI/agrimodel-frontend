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
  Box,
  TablePagination, // Import TablePagination
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Initial data
const initialData = [
  { name: 'AFarmer Community', numberOfMembers: '100', numberOfPosts: '12023', createdDate: '2023-10-01' },
  { name: 'BFarmer Community', numberOfMembers: '100', numberOfPosts: '546', createdDate: '2023-09-15' },
  { name: 'CFarmer Community', numberOfMembers: '100', numberOfPosts: '345', createdDate: '2023-08-22' },
  { name: 'DFarmer Community', numberOfMembers: '100', numberOfPosts: '456', createdDate: '2023-07-30' },
  { name: 'EFarmer Community', numberOfMembers: '100', numberOfPosts: '12023', createdDate: '2023-10-01' },
  { name: 'FGFarmer Community', numberOfMembers: '100', numberOfPosts: '345', createdDate: '2023-08-22' },
  { name: 'GFarmer Community', numberOfMembers: '100', numberOfPosts: '456', createdDate: '2023-07-30' },
  { name: 'HFarmer Community', numberOfMembers: '100', numberOfPosts: '12023', createdDate: '2023-10-01' },
  { name: 'IFarmer Community', numberOfMembers: '100', numberOfPosts: '546', createdDate: '2023-09-15' },
  { name: 'JFarmer Community', numberOfMembers: '100', numberOfPosts: '345', createdDate: '2023-08-22' },
  { name: 'KFarmer Community', numberOfMembers: '100', numberOfPosts: '456', createdDate: '2023-07-30' },
  { name: 'LFarmer Community', numberOfMembers: '100', numberOfPosts: '12023', createdDate: '2023-10-01' },
  { name: 'MGFarmer Community', numberOfMembers: '100', numberOfPosts: '345', createdDate: '2023-08-22' },
  { name: 'NFarmer Community', numberOfMembers: '100', numberOfPosts: '456', createdDate: '2023-07-30' },
];

const Community = ({ data = initialData, width = '100%', maxHeight = '380px' }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(8); // Rows per page

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
        return reversed ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the sorted data for the current page
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width, margin: 'auto', padding: 4, mt: 1, boxShadow: 'none' }} elevation={0}>
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
          sx: { height: '35px', width: '300px', mt: -5 },
        }}
        value={search}
        onChange={handleSearchChange}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end', // Aligns the button to the right
          padding: 2,
          mt: -8,
          mr: -2
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'green',
            '&:hover': {
              backgroundColor: 'darkgreen',
            },
            padding: '4px 12px', // Adjust padding for height and width
            textTransform: 'none', // Prevent text from being transformed to uppercase
            display: 'flex', // Make the button a flex container
            alignItems: 'center', // Center the icon and text vertically
          }}
        >
          <AddIcon sx={{ marginRight: '8px' }} />
          Create new community
        </Button>
      </Box>

      <TableContainer sx={{maxHeight, overflowY: 'auto', border: '1px solid #ddd' }}>
        <Table size="small">
        <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#F5F7F9' }}>
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
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{index + 1 + page * rowsPerPage}</TableCell>
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

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[8, 25, 50]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          display: 'flex',
          justifyContent: 'center', // Center the pagination
          marginTop: '16px',
        }}
      />
    </Paper>
  );
};

export default Community;

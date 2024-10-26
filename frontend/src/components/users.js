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
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProfileCard from './personDetails';

// Initial data
const initialData = [
  { name: 'Athena Weissnat', email: 'Elouise.Prohaska@yahoo.com', phone: '123-456-7890', status: 'Active' },
  { name: 'Deangelo Runolfsson', email: 'Kadin_Trantow87@yahoo.com', phone: '234-567-8901', status: 'Inactive' },
  { name: 'Danny Carter', email: 'Marina3@hotmail.com', phone: '345-678-9012', status: 'Active' },
  { name: 'Trace Tremblay PhD', email: 'Antonina.Pouros@yahoo.com', phone: '456-789-0123', status: 'Inactive' },
  { name: 'Derek Dibbert', email: 'Abagail29@hotmail.com', phone: '567-890-1234', status: 'Active' },
  { name: 'Viola Bernhard', email: 'Jamie23@hotmail.com', phone: '678-901-2345', status: 'Inactive' },
  { name: 'Austin Jacobi', email: 'Genesis42@yahoo.com', phone: '789-012-3456', status: 'Active' },
  { name: 'hena Weissnat', email: 'Elouise.Prohaska@yahoo.com', phone: '123-456-7890', status: 'Active' },
  { name: 'eangelo Runolfsson', email: 'Kadin_Trantow87@yahoo.com', phone: '234-567-8901', status: 'Inactive' },
  { name: 'anny Carter', email: 'Marina3@hotmail.com', phone: '345-678-9012', status: 'Active' },
  { name: 'race Tremblay PhD', email: 'Antonina.Pouros@yahoo.com', phone: '456-789-0123', status: 'Inactive' },
  { name: 'erek Dibbert', email: 'Abagail29@hotmail.com', phone: '567-890-1234', status: 'Active' },
  { name: 'iola Bernhard', email: 'Jamie23@hotmail.com', phone: '678-901-2345', status: 'Inactive' },
  { name: 'ustin Jacobi', email: 'Genesis42@yahoo.com', phone: '789-012-3456', status: 'Active' },
];

const statusStyles = {
  Active: {
    backgroundColor: '#d4edda',
    color: '#155724',
    display: 'inline-block',
    padding: '0px 10px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    marginTop: '8px',
    marginBottom: '8px',
  },
  Inactive: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    marginTop: '8px',
    marginBottom: '8px',
  },
};

const Users = ({ data = initialData, width = '100%', maxHeight = '380px' }) => {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(8); // Default to 8 users per page

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

  const handleViewClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Calculate displayed data
  const displayedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width, margin: 'auto', padding: 4, mt: 1, boxShadow: 'none' }} elevation={0}>
      {selectedUser ? (
        <ProfileCard user={selectedUser} onClose={handleCloseProfile} />
      ) : (
      <>
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
          sx={{ height: '30px', marginBottom: -3 }} // Reduced height
          value={search}
          onChange={handleSearchChange}
        />
        <TableContainer sx={{ maxHeight, overflowY: 'auto', border: '1px solid #ddd' }}>
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
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={sortBy === 'email'}
                    direction={reverseSortDirection ? 'desc' : 'asc'}
                    onClick={() => setSorting('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={sortBy === 'status'}
                    direction={reverseSortDirection ? 'desc' : 'asc'}
                    onClick={() => setSorting('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell padding="none" align="left" sx={{ padding: 1, fontSize: '0.75rem', fontWeight: 'bold' }}>Manage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.length > 0 ? (
                displayedData.map((row, index) => (
                  <TableRow key={row.name}>
                    <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.name}</TableCell>
                    <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.email}</TableCell>
                    <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>{row.phone}</TableCell>
                    <TableCell align="left" sx={statusStyles[row.status]}>
                      {row.status}
                    </TableCell>
                    <TableCell align="left" sx={{ padding: 1, fontSize: '0.70rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'blue' }}
                      onClick={() => handleViewClick(row)}
                      >
                        View <ArrowForwardIcon sx={{ marginLeft: 1, fontSize: '16px' }} />
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No results found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 25, 50]} // Update options to reflect default of 8
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}
        />
      </>
      )}
    </Paper>
  );
};

export default Users;

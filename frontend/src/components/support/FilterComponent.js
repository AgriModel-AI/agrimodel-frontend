import React, { useState } from 'react';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';
import {
    Box,
    MenuItem,
    Button,
    OutlinedInput
} from '@mui/material';

const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        width: 500,
        borderRadius: 4, // Adjust for similar rounded corners
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Add shadow for dropdown
        '&:hover fieldset': {
            borderColor: '#4caf50', // Optional: Green hover border
        },
    },
    '& .MuiSelect-icon': {
        color: '#333', // Dropdown arrow color
    },
}));

const FilterComponent = () => {
    const [sortOption, setSortOption] = useState('latest');
    const [statusOption, setStatusOption] = useState('open');

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatusOption(event.target.value);
    };

    const handleFilter = () => {
        console.log(`Sort by: ${sortOption}, Status: ${statusOption}`);
        // Perform filtering logic here
    };

    return (
        <Box display="flex" gap={1} alignItems="center" justifyContent={'space-between'} sx={{ width: '100%' }} mb={5}>
            <Box display="flex" gap={3} alignItems="center">
                <StyledSelect
                    variant="outlined"
                    sx={{
                        width: 250,
                        height: 50,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                    value={sortOption}  // Bind to state
                    onChange={handleSortChange}  // Update state on change
                >
                    <MenuItem value="latest">Latest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                </StyledSelect>
                <StyledSelect
                    variant="outlined"
                    sx={{
                        width: 250,
                        height: 50,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                    value={statusOption}  // Bind to state
                    onChange={handleStatusChange}  // Update state on change
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                </StyledSelect>
            </Box>

            <Button
                variant="contained"
                color="success"
                onClick={handleFilter}
                sx={{
                    width: 150,
                    height: 50,
                }}
            >
                Filter
            </Button>
        </Box>
    );
};

export default FilterComponent;

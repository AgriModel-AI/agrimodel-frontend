import React, { useState } from 'react';

import { Box  } from '@mui/material';
import ReportCard from './ReportCard';

const ReportList = () => {
    const reports = [
      {
        title: 'File upload problem',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas nulla eget hendrerit. Eu est aenean montes lorem purus.',
        date: '4 days ago',
        status: 'In Progress',
      },
      {
        title: 'File upload problem',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas nulla eget hendrerit. Eu est aenean montes lorem purus.',
        date: '4 days ago',
        status: 'In Progress',
      },
      {
        title: 'File upload problem',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas nulla eget hendrerit. Eu est aenean montes lorem purus.',
        date: '4 days ago',
        status: 'In Progress',
      },
      // Add more reports as needed
    ];
  
    const handleStatusChange = (newStatus, data) => {
      // Implement your status change logic here
      console.log(`Status changed to: ${newStatus}`, data);
    };
  
    return (
      <Box sx={{ padding: 0 }}>
        {reports.map((report, index) => (
          <ReportCard
            key={index}
            title={report.title}
            description={report.description}
            date={report.date}
            status={report.status}
            onStatusChange={handleStatusChange}
          />
        ))}
      </Box>
    );
  };

export default ReportList;
import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const FilterComponent = () => {
  const [sortOption, setSortOption] = useState('latest');
  const [statusOption, setStatusOption] = useState('open');

  const handleSortChange = (key) => {
    setSortOption(key);
  };

  const handleStatusChange = (key) => {
    setStatusOption(key);
  };

  const handleFilter = () => {
    console.log(`Sort by: ${sortOption}, Status: ${statusOption}`);
    // Perform filtering logic here
  };

  return (
    <div className="flex items-center justify-between w-full mb-5 space-x-3">
      <div className="flex items-center space-x-3">
        <Dropdown>
          <DropdownTrigger>
            <Button flat color="primary" auto>
              Sort by: {sortOption}
            </Button>
          </DropdownTrigger>
          <DropdownMenu onAction={handleSortChange}>
            <DropdownItem key="latest">Latest First</DropdownItem>
            <DropdownItem key="oldest">Oldest First</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button flat color="primary" auto>
              Status: {statusOption}
            </Button>
          </DropdownTrigger>
          <DropdownMenu onAction={handleStatusChange}>
            <DropdownItem key="all">All</DropdownItem>
            <DropdownItem key="open">Open</DropdownItem>
            <DropdownItem key="in-progress">In Progress</DropdownItem>
            <DropdownItem key="closed">Closed</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Button onPress={handleFilter} color="success" auto>
        Filter
      </Button>
    </div>
  );
};

export default FilterComponent;

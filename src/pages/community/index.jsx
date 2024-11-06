import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  useDisclosure
} from "@nextui-org/react";

import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@nextui-org/modal";
import { MdPeople } from "react-icons/md";

import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";

import { PlusIcon } from "../../components/diseases/PlusIcon";
import { VerticalDotsIcon } from "../../components/diseases/VerticalDotsIcon";
import { SearchIcon } from "../../components/diseases/SearchIcon";
import { statusOptions} from "../../components/diseases/data";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunities, deleteCommunity  } from "../../redux/slices/communitySlice";
import { formatDate } from "../../utils/dateUtil";
import { useToast } from "@chakra-ui/react";


const columns = [
  {name: "ID", uid: "communityId", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "DESCRIPTION", uid: "description", sortable: true},
  {name: "NUMBER OF FARMERS", uid: "users", sortable: true},
  {name: "NUMBER OF POSTS", uid: "posts", sortable: true},
  {name: "CREATED BY", uid: "createdBy", sortable: true},
  {name: "CREATED AT", uid: "createdAt", sortable: true},
  {name: "ACTIONS", uid: "actions", sortable: true},
];
const INITIAL_VISIBLE_COLUMNS = ["name", "description", "users", "posts", "createdBy", "createdAt", "actions"];

export default function Disease() {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });

  const { hasFetched, communities } = useSelector((state)=> state.communities);

  useEffect(()=> {
    if(!hasFetched) {
      dispatch(fetchCommunities());
    }
  }, [hasFetched, dispatch]);

  const handleDeleteConfirm = async () => {
    console.log(selectedCommunity);
    if (selectedCommunity) {
      dispatch(deleteCommunity(selectedCommunity))
      .then(() => {
        toast({
          title: "Success",
          description: "Community deleted successfully!",
          status: "success",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete community. Please try again later.",
          status: "error",
          duration: 3000,
        });
      })
      .finally(() => onOpenChange());
    }
  };


  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...communities];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [communities, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: user.image
                ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/communities/image/${user.image}` 
                : undefined,
            }}
            name={cellValue}
          >
            {user.name}
          </User>
        );
      case "createdBy":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user?.createdBy?.username}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{user?.createdBy?.email}</p>
          </div>
        );


      case "createdAt":
        return formatDate(cellValue)
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem href={`/dashboard/community/view?id=${user.communityId}`}>View</DropdownItem>
                <DropdownItem href={`/dashboard/community/update?id=${user.communityId}`}>Edit</DropdownItem>
                <DropdownItem onPress={() => { setSelectedCommunity(user.communityId); onOpen(); }}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Breadcrumbs className="mb-5">
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/community">Community</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex items-center my-4 space-x-3">
          <MdPeople size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">Community</h2>
        </div>
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            variant="faded"
          />
          <div className="flex gap-3">            
            <Button color="primary" endContent={<PlusIcon />} onClick={()=> {navigate("/dashboard/community/add");}}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {communities.length} communities</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    communities.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="px-4 sm:px-2 md:px-10 lg:px-20 mt-4">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No Communities found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.communityId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this community? This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleDeleteConfirm}>
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

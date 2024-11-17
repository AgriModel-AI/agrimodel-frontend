import React, { useEffect } from "react";
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
  Chip,
  User,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody
} from "@nextui-org/react";


import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import { MdPerson } from "react-icons/md";

import { PlusIcon } from "../../components/diseases/PlusIcon";
import { VerticalDotsIcon } from "../../components/diseases/VerticalDotsIcon";
import { SearchIcon } from "../../components/diseases/SearchIcon";
import { ChevronDownIcon } from "../../components/diseases/ChevronDownIcon";
import { capitalize } from "../../components/diseases/utils";
import { Link, useNavigate } from 'react-router-dom';
import { fetchClients } from "../../redux/slices/clientsSlice";
import { useDispatch, useSelector } from "react-redux";

const statusColorMap = {
  true: "success",
  false: "danger",
};

const columns = [
  {name: "ID", uid: "userId", sortable: true},
  {name: "NAME", uid: "username", sortable: true},
  {name: "PHONENUMBER", uid: "phone_number", sortable: true},
  {name: "DISTRICT", uid: "district", sortable: true},
  {name: "ROLE", uid: "role", sortable: true},
  {name: "ISVERIFIED", uid: "isVerified", sortable: true},
  {name: "ISBLOCKED", uid: "isBlocked", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

const INITIAL_VISIBLE_COLUMNS = ["username", "phone_number", "district", "role", "isVerified", "isBlocked", "actions"];

export default function Disease() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {clients, hasFetched} = useSelector((state) => state.clients);

  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });


  useEffect(()=> {
    if(!hasFetched) {
      dispatch(fetchClients());
    }
  }, [dispatch, hasFetched])

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "phone_number",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...clients];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user.name && user.name.toLowerCase().includes(filterValue.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(filterValue.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(filterValue.toLowerCase()))
      );
    }
    

    return filteredUsers;
  }, [clients, filterValue, statusFilter]);

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
      case "username":
        return (
          <User
            avatarProps={{radius: "lg", src: user.profilePicture, onClick: () => setImageModal({ isOpen: true, src: user.profilePicture }),}}
            description={user.email}
            name={cellValue}
            alt="Profile"
            size='sm'
            referrerPolicy="no-referrer"
          >
            {user.username}
          </User>
        );
      case "district":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.district ? user.district.districtName : "Unknown district"}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.district ? user.district.provinceName : "Unknown province"}
            </p>
          </div>
        );
        
      case "isBlocked":
        return (
          <div className="flex items-center space-x-2">
            {user.isBlocked ? (
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-red-100 text-red-700 text-sm shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.29 14.3a1 1 0 0 1-1.41 0L12 13.41l-2.88 2.89a1 1 0 0 1-1.41-1.41L10.59 12l-2.88-2.88a1 1 0 1 1 1.41-1.41L12 10.59l2.88-2.88a1 1 0 0 1 1.41 1.41L13.41 12l2.88 2.88a1 1 0 0 1 0 1.41z"/>
                </svg>
                Blocked
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 15l-3.5-3.5 1.42-1.42L10 12.17l5.09-5.09 1.41 1.41L10 15zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
                </svg>
                Unblocked
              </span>
            )}
          </div>
        );

      case "isVerified":
        return (
          <Chip className="capitalize" color={statusColorMap[user.isVerified]} size="sm" variant="flat">
            {cellValue ? 'Verified' : 'Not Verified'}
          </Chip>
        );
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
                <DropdownItem as={Link} to={`/dashboard/clients/view?id=${user.userId}`}>View</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue ? cellValue : "Not provided";
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
          <BreadcrumbItem href="/dashboard/clients">Users</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center my-4 space-x-3">
          <MdPerson size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="flex gap-3">            
            <Button color="primary" endContent={<PlusIcon />} onClick={()=> {navigate("/dashboard/clients/create-admin");}}>
              Create New Admin
            </Button>
          </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {clients.length} users</span>
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
    clients.length,
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
        <TableBody emptyContent={"No Users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.userId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>User Image</ModalHeader>
          <ModalBody>
            <img src={imageModal.src} alt="User" className="w-full h-auto" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

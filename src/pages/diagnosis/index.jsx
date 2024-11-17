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
import { MdAssignment } from "react-icons/md";
import { SearchIcon } from "../../components/diseases/SearchIcon";
import { ChevronDownIcon } from "../../components/diseases/ChevronDownIcon";
import { capitalize } from "../../components/diseases/utils";
import { useNavigate } from 'react-router-dom';
import { fetchDiagnosisResults } from "../../redux/slices/diagnosisResult";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/dateUtil";

const statusColorMap = {
  true: "success",
  false: "danger",
};

const columns = [
  {name: "ID", uid: "resultId", sortable: true},
  {name: "FARMER", uid: "user", sortable: true},
  {name: "IMAGE", uid: "image_path", sortable: true},
  {name: "DISTRICT", uid: "district", sortable: true},
  {name: "DISEASE", uid: "disease", sortable: true},
  {name: "DETECTED", uid: "detected", sortable: true},
  {name: "DATE", uid: "date", sortable: true},
];

const INITIAL_VISIBLE_COLUMNS = ["image_path", "user", "district", "disease", "detected", "date"];

export default function Disease() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {results, hasFetched} = useSelector((state) => state.diagnosis)


  useEffect(()=> {
    if(!hasFetched) {
      dispatch(fetchDiagnosisResults());
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

  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...results];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user.user && user.user.username.toLowerCase().includes(filterValue.toLowerCase())) ||
        (user.district && user.district.districtName.toLowerCase().includes(filterValue.toLowerCase())) ||
        (user.district && user.district.provinceName.toLowerCase().includes(filterValue.toLowerCase())) ||
        (user.disease && user.disease.name.toLowerCase().includes(filterValue.toLowerCase()))
      );
    }
    

    return filteredUsers;
  }, [results, filterValue, statusFilter]);

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

      case "image_path":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: cellValue,
              onClick: () => setImageModal({ isOpen: true, src: cellValue }),
            }}
            
          >
          </User>
        );
        
      case "user":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.user ? user.user.username : "Unknown user"}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.user ? user.user.email : "Unknown email"}
            </p>
          </div>
        );

      case "date":
          return formatDate(cellValue)

      case "disease":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{user.disease ? user.disease.name : "Unknown Disease"}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.disease ? `ID: #${user.disease.id}` : "Unknown ID"}
            </p>
          </div>
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
        
      case "detected":
        return (
          <Chip className="capitalize" color={statusColorMap[user.isVerified]} size="sm" variant="flat">
            {cellValue ? 'Detected' : 'Not Detected'}
          </Chip>
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
          <BreadcrumbItem href="/dashboard/diagnosis">diagnosis results</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center my-4 space-x-3">
          <MdAssignment size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">Diagnosis Results</h2>
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
          </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {results.length} diagnosis results</span>
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
    results.length,
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
        <TableBody emptyContent={"No results found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.resultId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>Diagnosis Image</ModalHeader>
          <ModalBody>
            <img src={imageModal.src} alt="Diagnosis" className="w-full h-auto" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

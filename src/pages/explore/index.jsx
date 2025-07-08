// ExploreList.jsx
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
  User,
  Pagination,
  useDisclosure,
  Chip
} from "@nextui-org/react";

import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@nextui-org/modal";

import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";

import { PlusIcon } from "../../components/crops/PlusIcon";
import { VerticalDotsIcon } from "../../components/crops/VerticalDotsIcon";
import { SearchIcon } from "../../components/crops/SearchIcon";
import { MdExplore } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { deleteExplore, fetchExplore } from "../../redux/slices/exploreSlice";
import { useToast } from "@chakra-ui/react";

const INITIAL_VISIBLE_COLUMNS = ["title", "type", "content", "date", "actions"];

const columns = [
  { name: "Title", uid: "title", sortable: true },
  { name: "Type", uid: "type", sortable: true },
  { name: "Content", uid: "content", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Actions", uid: "actions" },
];

export default function Explore() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { exploreItems, hasFetched } = useSelector((state) => state.explore);

  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchExplore());
    }
  }, [hasFetched, dispatch]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedItemId, setSelectedItemId] = React.useState(null);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "date",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...exploreItems];

    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filtered;
  }, [exploreItems, filterValue, hasSearchFilter]);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDeleteClick = (id) => {
    setSelectedItemId(id);
    onOpen();
  };

  const confirmDelete = () => {
    dispatch(deleteExplore(selectedItemId))
      .then(() => {
        toast({
          title: "Success",
          description: "Explore item deleted successfully",
          status: "success",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete explore item",
          status: "error",
          duration: 3000,
        });
      })
      .finally(() => onOpenChange(false));
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'UPDATES':
        return 'primary';
      case 'ONLINE_SERVICES':
        return 'success';
      case 'DISEASE_LIBRARY':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "title":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: item.image,
              onClick: () => setImageModal({ isOpen: true, src: item.image })
            }}
            name={cellValue}
          >
          </User>
        );
      case "content":
        return cellValue?.length > 50 ? `${cellValue.substring(0, 50)}...` : cellValue || "N/A";
      case "date":
        return new Date(cellValue).toLocaleDateString();
      case "type":
        return (
          <Chip 
            color={getTypeColor(cellValue)} 
            variant="flat" 
            size="sm"
          >
            {cellValue}
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
                <DropdownItem onPress={() => navigate(`/dashboard/explore/view/${item.id}`)}>View</DropdownItem>
                <DropdownItem onPress={() => navigate(`/dashboard/explore/update/${item.id}`)}>Edit</DropdownItem>
                <DropdownItem onPress={() => handleDeleteClick(item.id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [handleDeleteClick, navigate]);

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
    setFilterValue("");
    setPage(1);
  },[]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Breadcrumbs className="mb-5">
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard/explore">Explore</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center my-4 space-x-3">
          <MdExplore size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">Explore</h2>
        </div>

        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by title..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button color="primary" endContent={<PlusIcon />} onClick={()=> {navigate("/dashboard/explore/add");}}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {exploreItems.length} items</span>
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
  }, [filterValue, onSearchChange, exploreItems.length, onRowsPerPageChange, onClear, navigate]);

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
  }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  return (
    <div className="px-4 sm:px-2 md:px-10 lg:px-20 mt-4">
      <Table
        aria-label="Explore items table"
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
        <TableBody emptyContent={"No explore items found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}> 
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
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
                Are you sure you want to delete this explore item? This action cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>Explore Item Image</ModalHeader>
          <ModalBody>
            <img src={imageModal.src} alt="Explore item" className="w-full h-auto" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
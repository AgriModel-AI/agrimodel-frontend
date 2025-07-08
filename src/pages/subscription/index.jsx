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

import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";

import { PlusIcon } from "../../components/crops/PlusIcon";
import { VerticalDotsIcon } from "../../components/crops/VerticalDotsIcon";
import { SearchIcon } from "../../components/crops/SearchIcon";
import { RiVipCrownLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { deleteSubscriptionPlan, fetchSubscriptionPlans } from "../../redux/slices/subscriptionPlanSlice";
import { useToast } from "@chakra-ui/react";

const INITIAL_VISIBLE_COLUMNS = ["name", "dailyAttempts", "monthlyPrice", "yearlyPrice", "yearlyDiscountPercentage", "isPlanFree", "isActive", "actions"];

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Daily Attempts", uid: "dailyAttempts", sortable: true },
  { name: "Monthly Price", uid: "monthlyPrice", sortable: true },
  { name: "Yearly Price", uid: "yearlyPrice", sortable: true },
  { name: "Yearly Discount %", uid: "yearlyDiscountPercentage", sortable: true },
  { name: "Free Plan", uid: "isPlanFree", sortable: true },
  { name: "Active", uid: "isActive", sortable: true },
  { name: "Actions", uid: "actions" },
];

export default function SubscriptionPlanList() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { plans, hasFetched } = useSelector((state) => state.subscriptionPlans);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchSubscriptionPlans());
    }
  }, [hasFetched, dispatch]);

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedPlanId, setSelectedPlanId] = React.useState(null);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPlans = [...plans];

    if (hasSearchFilter) {
      filteredPlans = filteredPlans.filter((plan) =>
        plan.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredPlans;
  }, [plans, filterValue, hasSearchFilter]);

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

  const handleDeleteClick = (planId) => {
    setSelectedPlanId(planId);
    onOpen();
  };

  const confirmDelete = () => {
    dispatch(deleteSubscriptionPlan(selectedPlanId))
      .then(() => {
        toast({
          title: "Success",
          description: "Subscription plan deleted successfully",
          status: "success",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete subscription plan",
          status: "error",
          duration: 3000,
        });
      })
      .finally(() => onOpenChange(false));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderCell = React.useCallback((plan, columnKey) => {
    const cellValue = plan[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold capitalize">{cellValue}</p>
            {plan.description && (
              <p className="text-small text-default-500">{plan.description}</p>
            )}
          </div>
        );
      case "dailyAttempts":
        return <p>{cellValue || 0}</p>;
      case "monthlyPrice":
        return <p>{formatPrice(cellValue)}</p>;
      case "yearlyPrice":
        return <p>{formatPrice(cellValue)}</p>;
      case "yearlyDiscountPercentage":
        return <p>{cellValue}%</p>;
      case "isPlanFree":
        return (
          <Chip
            color={cellValue ? "success" : "default"}
            variant="flat"
            size="sm"
          >
            {cellValue ? "Yes" : "No"}
          </Chip>
        );
      case "isActive":
        return (
          <Chip
            color={cellValue ? "success" : "danger"}
            variant="flat"
            size="sm"
          >
            {cellValue ? "Active" : "Inactive"}
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
                <DropdownItem onPress={() => navigate(`/dashboard/subscriptions/plans/view/${plan.planId}`)}>View</DropdownItem>
                <DropdownItem onPress={() => navigate(`/dashboard/subscriptions/plans/update/${plan.planId}`)}>Edit</DropdownItem>
                <DropdownItem onPress={() => handleDeleteClick(plan.planId)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [navigate]);

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
          <BreadcrumbItem href="/dashboard/subscriptions/plans">Subscription Plans</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center my-4 space-x-3">
          <RiVipCrownLine size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">Subscription Plans</h2>
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
          />
          <div className="flex gap-3">
            <Button 
              color="primary" 
              endContent={<PlusIcon />} 
              onClick={()=> {navigate("/dashboard/subscriptions/plans/add");}}
            >
              Add New Plan
            </Button>
            <Button 
              color="secondary" 
              onClick={()=> {navigate("/dashboard/subscriptions");}}
            >
              View Subscriptions
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {plans.length} plans</span>
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
  }, [filterValue, onSearchChange, plans.length, onRowsPerPageChange, onClear, navigate]);

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
        aria-label="Subscription Plans Table"
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
        <TableBody emptyContent={"No subscription plans found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.planId}>
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
                Are you sure you want to delete this subscription plan? This action cannot be undone.
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
    </div>
  );
}
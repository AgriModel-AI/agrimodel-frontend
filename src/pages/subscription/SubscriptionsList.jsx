// SubscriptionsList.jsx
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
  Chip,
  Pagination,
  User,
  Tooltip
} from "@nextui-org/react";

import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";

import { SearchIcon } from "../../components/crops/SearchIcon";
import { RiVipCrownLine, RiArrowLeftLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions } from "../../redux/slices/subscriptionSlice";
import { fetchClients } from "../../redux/slices/clientsSlice";
import { fetchSubscriptionPlans } from "../../redux/slices/subscriptionPlanSlice";

const INITIAL_VISIBLE_COLUMNS = ["user", "plan", "startDate", "endDate", "type", "isActive", "paymentReference"];

const columns = [
  { name: "User", uid: "user", sortable: true },
  { name: "Plan", uid: "plan", sortable: true },
  { name: "Start Date", uid: "startDate", sortable: true },
  { name: "End Date", uid: "endDate", sortable: true },
  { name: "Type", uid: "type", sortable: true },
  { name: "Status", uid: "isActive", sortable: true },
  { name: "Payment Ref", uid: "paymentReference", sortable: true },
];

export default function SubscriptionsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subscriptions, hasFetched: subsFetched } = useSelector((state) => state.subscriptions);
  const { clients, hasFetched: clientsFetched } = useSelector((state) => state.clients);
  const { plans, hasFetched: plansFetched } = useSelector((state) => state.subscriptionPlans);

  useEffect(() => {
    if (!subsFetched) {
      dispatch(fetchSubscriptions());
    }
    if (!clientsFetched) {
      dispatch(fetchClients());
    }
    if (!plansFetched) {
      dispatch(fetchSubscriptionPlans());
    }
  }, [dispatch, subsFetched, clientsFetched, plansFetched]);

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "startDate",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  // Find user and plan info
  const subscriptionsWithData = React.useMemo(() => {
    return subscriptions.map(subscription => {
      const user = clients.find(client => client.userId === subscription.userId) || { username: 'Unknown' };
      const plan = plans.find(plan => plan.planId === subscription.planId) || { name: 'Unknown' };
      
      return {
        ...subscription,
        userInfo: user,
        planInfo: plan
      };
    });
  }, [subscriptions, clients, plans]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...subscriptionsWithData];

    if (hasSearchFilter) {
      filtered = filtered.filter((item) => {
        const username = item.userInfo?.username?.toLowerCase() || '';
        const planName = item.planInfo?.name?.toLowerCase() || '';
        const searchTerm = filterValue.toLowerCase();
        
        return username.includes(searchTerm) || planName.includes(searchTerm);
      });
    }

    return filtered;
  }, [subscriptionsWithData, filterValue, hasSearchFilter]);

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCell = React.useCallback((item, columnKey) => {
    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{
              radius: "full",
              src: item.userInfo?.profilePicture,
              fallback: (
                <p className="bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                  {item.userInfo?.username?.charAt(0).toUpperCase() || "?"}
                </p>
              ),
            }}
            name={item.userInfo?.username || "Unknown User"}
            description={item.userInfo?.email || "No email"}
          />
        );
      case "plan":
        return (
          <div>
            <p className="font-medium">{item.planInfo?.name || "Unknown Plan"}</p>
            <p className="text-xs text-gray-500">
              Daily Attempts: {item.dailyAttempts || item.planInfo?.dailyAttempts || "N/A"}
            </p>
          </div>
        );
      case "startDate":
        return formatDate(item.startDate);
      case "endDate":
        return formatDate(item.endDate);
      case "type":
        return (
          <Chip 
            color={item.subscriptionType === "yearly" ? "primary" : "secondary"} 
            variant="flat" 
            size="sm"
          >
            {item.subscriptionType || "N/A"}
          </Chip>
        );
      case "isActive":
        return (
          <Chip 
            color={item.isActive ? "success" : "warning"} 
            variant="flat" 
            size="sm"
          >
            {item.isActive ? "Active" : "Inactive"}
          </Chip>
        );
      case "paymentReference":
        return item.paymentReference ? (
          <Tooltip content="Payment reference ID">
            <Chip color="default" variant="flat" size="sm">
              #{item.paymentReference}
            </Chip>
          </Tooltip>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      default:
        return item[columnKey];
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
    setFilterValue("");
    setPage(1);
  },[]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Breadcrumbs className="mb-5">
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrent href="/dashboard/subscriptions">Subscriptions</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center my-4 space-x-3">
          <RiVipCrownLine size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">User Subscriptions</h2>
        </div>

        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by username or plan..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button 
              color="primary" 
              variant="flat"
              startContent={<RiArrowLeftLine />}
              onClick={()=> {navigate("/dashboard/subscriptions/plans");}}
            >
              Manage Plans
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {subscriptions.length} subscriptions</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, subscriptions.length, onRowsPerPageChange, onClear, navigate]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          Showing {items.length} of {filteredItems.length} subscriptions
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
  }, [filteredItems.length, items.length, page, pages, onPreviousPage, onNextPage]);

  return (
    <div className="px-4 sm:px-2 md:px-10 lg:px-20 mt-4">
      <Table
        aria-label="User Subscriptions Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
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
        <TableBody 
          emptyContent={"No subscriptions found"} 
          items={sortedItems}
          loadingContent={<div>Loading subscriptions...</div>}
          loadingState={subsFetched && clientsFetched && plansFetched ? "idle" : "loading"}
        >
          {(item) => (
            <TableRow key={item.subscriptionId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
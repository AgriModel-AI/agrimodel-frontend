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
  Badge,
} from "@nextui-org/react";

import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";

import { PlusIcon } from "../../components/crops/PlusIcon";
import { SearchIcon } from "../../components/crops/SearchIcon";
import { MdMemory, MdStar } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchModels } from "../../redux/slices/modelSlice";
import { useToast } from "@chakra-ui/react";

const INITIAL_VISIBLE_COLUMNS = ["version", "fileSize", "accuracy", "releaseDate", "ratings", "isActive", "actions"];

const columns = [
  { name: "Version", uid: "version", sortable: true },
  { name: "File Size", uid: "fileSize", sortable: true },
  { name: "Accuracy", uid: "accuracy", sortable: true },
  { name: "Release Date", uid: "releaseDate", sortable: true },
  { name: "Ratings", uid: "ratings", sortable: true },
  { name: "Status", uid: "isActive", sortable: true },
  { name: "Actions", uid: "actions" },
];

export default function ModelList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Safely access the Redux state with fallback values
  const modelsState = useSelector((state) => state.models) || {};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const modelsWithRatings = modelsState.models || [];
  const hasFetched = modelsState.hasFetched || false;
  const loading = modelsState.loading || false;

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchModels());
    }
  }, [hasFetched, dispatch]);

  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "releaseDate",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = modelsWithRatings;

    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.model.version.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filtered;
  }, [modelsWithRatings, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      let first, second;
      
      // Special handling for ratings count
      if (sortDescriptor.column === "ratings") {
        first = a.ratings.length;
        second = b.ratings.length;
      } else {
        first = a.model[sortDescriptor.column];
        second = b.model[sortDescriptor.column];
      }
      
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return null;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  const renderCell = React.useCallback((item, columnKey) => {
    const model = item.model;
    const ratings = item.ratings;

    switch (columnKey) {
      case "version":
        return (
          <div className="flex flex-col">
            <p className="font-medium">{model.version}</p>
            <p className="text-xs text-gray-500">ID: {model.modelId.substring(0, 8)}...</p>
          </div>
        );
      case "fileSize":
        return <p>{formatFileSize(model.fileSize)}</p>;
      case "accuracy":
        return (
          <Chip 
            color={model.accuracy ? "success" : "default"} 
            variant="flat" 
            size="sm"
          >
            {model.accuracy ? `${model.accuracy}%` : "Not tested"}
          </Chip>
        );
      case "releaseDate":
        return formatDate(model.releaseDate);
      case "ratings":
        const avgRating = calculateAverageRating(ratings);
        return (
          <div className="flex items-center">
            {avgRating ? (
              <>
                <Badge content={ratings.length} color="primary" size="sm">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">{avgRating}</span>
                    <MdStar className="text-yellow-500" />
                  </div>
                </Badge>
              </>
            ) : (
              <span className="text-gray-400">No ratings</span>
            )}
          </div>
        );
      case "isActive":
        return (
          <Chip 
            color={model.isActive ? "success" : "danger"} 
            variant="flat" 
            size="sm"
          >
            {model.isActive ? "Active" : "Inactive"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button 
              size="sm" 
              color="primary" 
              variant="flat" 
              onPress={() => navigate(`/dashboard/models/view/${model.modelId}`)}
            >
              View Details
            </Button>
          </div>
        );
      default:
        return model[columnKey];
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
          <BreadcrumbItem isCurrent href="/dashboard/models">AI Models</BreadcrumbItem>
        </Breadcrumbs>

        <div className="flex items-center my-4 space-x-3">
          <MdMemory size={28} color="#1a73e8" />
          <h2 className="text-2xl font-bold text-gray-800">AI Models</h2>
        </div>

        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by version..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button 
              color="primary" 
              endContent={<PlusIcon />} 
              onClick={()=> {navigate("/dashboard/models/add");}}
            >
              Upload New Model
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {modelsWithRatings.length} models</span>
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
  }, [filterValue, onSearchChange, modelsWithRatings.length, onRowsPerPageChange, onClear, navigate]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          Showing {items.length} of {filteredItems.length} models
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
        aria-label="AI Models Table"
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
          emptyContent={"No AI models found"} 
          items={sortedItems}
          loadingContent={<div>Loading models...</div>}
          loadingState={loading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.model.modelId}>
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
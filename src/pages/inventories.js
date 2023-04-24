import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Card,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OrdersSearch } from "src/sections/orders/orders-search";
import { applyPagination } from "src/utils/apply-pagination";
import { InventoryTable } from "src/sections/inventories/inventory-table";
import { collection, onSnapshot, query } from "@firebase/firestore";
import { db } from "src/firebase";
import { InventorySearch } from "src/sections/inventories/inventory-search";

const now = new Date();

// ORDER FUNCTIONS

const useOrders = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};
// const useOrders = (filteredData, page, rowsPerPage) => {
//   return useMemo(() => {
//     return applyPagination(filteredData, page, rowsPerPage);
//   }, [filteredData, page, rowsPerPage]);
// };

const useOrderIds = (orderList) => {
  return useMemo(() => {
    return orderList.map((thisOrder) => thisOrder.id);
  }, [orderList]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //
  const [currentWarehouse, setCurrentWarehouse] = useState(null);
  const [warehouseList, setWarehouseList] = useState([]);

  // const [searchTerm, setSearchTerm] = useState("");
  // Data will be inventory items
  const [data, setData] = useState([]);
  // const filteredData = data.filter((item) => {
  //   return searchTerm.toLowerCase() === ""
  //     ? item
  //     : item.itemName.toLowerCase().includes(searchTerm);
  // });
  const orderList = useOrders(data, page, rowsPerPage);
  // const orderList = useOrders(data, page, rowsPerPage);
  const orderIDs = useOrderIds(orderList);
  const orderSelection = useSelection(orderIDs);

  useEffect(() => {
    console.log("useEffect ran");
    const q = query(collection(db, "warehouses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let warehouses = [];
      querySnapshot.forEach((doc) => {
        warehouses.push({
          name: doc.data().information[0].name,
          id: doc.id,
        });
        setWarehouseList(warehouses);
      });
      if (currentWarehouse == null) {
        setCurrentWarehouse(warehouses[0]);
      }

      if (currentWarehouse != null) {
        const selectedWarehouse = querySnapshot.docs.find((doc) => doc.id === currentWarehouse.id);
        setData(selectedWarehouse?.data().Items);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [currentWarehouse]);

  console.log(data);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  //   const handleChange = useCallback((event) => {
  //     // setValue((prevState) => ({
  //     //   ...prevState,
  //     //   [event.target.name]: event.target.value,
  //     //   [event.target.id]: event.target.id,
  //     // }));
  //     const selectedWarehouse = warehouseList.find((doc) => doc.id === event.target.id);
  //     setCurrentWarehouse(selectedWarehouse);
  //   }, []);

  const handleChange = (event) => {
    // setValue((prevState) => ({
    //   ...prevState,
    //   [event.target.name]: event.target.value,
    //   [event.target.id]: event.target.id,
    // }));
    console.log(event.target.value);
    const selectedWarehouse = warehouseList.find((doc) => doc.id === event.target.value);
    console.log(selectedWarehouse);
    setCurrentWarehouse(selectedWarehouse);
  };

  // const handleSearchTerm = (event) => {
  //   setSearchTerm(event.target.value);
  // };
  console.log(warehouseList);
  console.log(currentWarehouse);

  return (
    <>
      <Head>
        <title>Inventory</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Inventory By Warehouse</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add Item(s)
                </Button>
              </div>
            </Stack>
            <TextField
              fullWidth
              label="Select Warehouse"
              name="warehouse"
              onChange={handleChange}
              required
              select
              SelectProps={{ native: true }}
              //   value={currentWarehouse?.name}
            >
              {warehouseList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </TextField>
            <InventorySearch />
            {/* <Card sx={{ p: 2 }}>
              <OutlinedInput
                defaultValue=""
                fullWidth
                placeholder="Search inventory"
                onChange={handleSearchTerm}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
                sx={{ maxWidth: 500 }}
              />
            </Card> */}
            <InventoryTable
              // count={data.length}
              count={data.length}
              items={orderList}
              onDeselectAll={orderSelection.handleDeselectAll}
              onDeselectOne={orderSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={orderSelection.handleSelectAll}
              onSelectOne={orderSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={orderSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

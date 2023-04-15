import { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OrdersSearch } from "src/sections/orders/orders-search";
import { applyPagination } from "src/utils/apply-pagination";
import { OrdersTable } from "src/sections/orders/orders-table";
import { collection, onSnapshot, query } from "@firebase/firestore";
import { db } from "src/firebase";

const now = new Date();

// ORDER FUNCTIONS

const useOrders = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useOrderIds = (orderList) => {
  return useMemo(() => {
    return orderList.map((thisOrder) => thisOrder.id);
  }, [orderList]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ORDER SECTION FOR DATA

  const [data, setData] = useState([]);
  const orderList = useOrders(data, page, rowsPerPage);
  const orderIDs = useOrderIds(orderList);
  const orderSelection = useSelection(orderIDs);

  const [poSearch, setPoSearch] = useState("");

  useEffect(() => {
    const qOrders = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(qOrders, (querySnapshot) => {
      const orders = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          warehouse: doc.data().inputs.warehouse,
          consignee: doc.data().inputs.consignee,
          createdDate: doc.data().inputs.creationDate,
          po: doc.data().inputs.PO,
          id: doc.id,
        });
      });
      setData(orders);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Orders</title>
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
                <Typography variant="h4">Orders</Typography>
                {/* <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack> */}
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
                  Add
                </Button>
              </div>
            </Stack>
            <OrdersSearch />
            <OrdersTable
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

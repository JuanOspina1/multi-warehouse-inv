import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";

const statusMap = {
  pending: "warning",
  delivered: "success",
  refunded: "error",
};

export const OverviewLatestOrders = (props) => {
  const { orders = [], sx } = props;
  console.log(orders);

  // {
  //   warehouse: doc.data().inputs.warehouse,
  //   consignee: doc.data().inputs.consignee,
  //   createdDate: doc.data().inputs.creationDate,
  //   po: doc.data().inputs.PO,
  //   id: doc.id,
  // }
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Orders" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PO</TableCell>
                <TableCell>Consignee</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell sortDirection="desc">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const createdAt = format(order.createdDate, "MM/dd/yyyy");

                return (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.po}</TableCell>
                    <TableCell>{order.consignee}</TableCell>
                    <TableCell>{order.warehouse}</TableCell>
                    {/* <TableCell>
                      <SeverityPill color={statusMap[order.status]}>{order.status}</SeverityPill>
                    </TableCell> */}
                    <TableCell>{createdAt}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object,
};

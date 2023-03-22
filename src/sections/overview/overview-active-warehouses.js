import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from "@mui/material";

export const OverviewActiveWarehouses = (props) => {
  const { warehouses = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Active Warehouses" />
      <List>
        {warehouses.map((warehouse, index) => {
          const hasDivider = index < warehouses.length - 1;
          // const ago = formatDistanceToNow(warehouse.updatedAt);

          return (
            <ListItem divider={hasDivider} key={warehouse.id}>
              {/* <ListItemAvatar>
                {warehouse.image ? (
                  <Box
                    component="img"
                    src={warehouse.image}
                    sx={{
                      borderRadius: 1,
                      height: 48,
                      width: 48,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: 1,
                      backgroundColor: "neutral.200",
                      height: 48,
                      width: 48,
                    }}
                  />
                )}
              </ListItemAvatar> */}
              <ListItemText
                primary={warehouse.name}
                primaryTypographyProps={{ variant: "subtitle1" }}
                // secondary={`Updated ${ago} ago`}
                // secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemText
                primary={warehouse.phone}
                primaryTypographyProps={{ variant: "subtitle1" }}
                // secondary={`Updated ${ago} ago`}
                // secondaryTypographyProps={{ variant: "body2" }}
              />
              {/* <IconButton edge="end">
                <SvgIcon>
                  <EllipsisVerticalIcon />
                </SvgIcon>
              </IconButton> */}
            </ListItem>
          );
        })}
      </List>
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

OverviewActiveWarehouses.propTypes = {
  warehouses: PropTypes.array,
  sx: PropTypes.object,
};

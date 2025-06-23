import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import _ from "lodash";
import PropTypes from "prop-types";
import { useState } from "react";
import { TableRowLoading } from "./components/TableRowLoading";
import { TableRowEmpty } from "./components/TableRowEmpty";
import { CellContent } from "./components/CellContent";

import CorePagination from "../CorePagination";

// Simple translation function
const translate = (key) => {
  const translations = {
    "table.no": "No",
    "table.description": "Description",
  };
  return translations[key] || key;
};

const TableHeadCommon = styled(TableHead)(() => ({
  backgroundColor: "white",
}));

const TableContainerCommon = styled(TableContainer)(() => ({
  boxShadow: "none!important",
  borderRadius: "10px",
  border: "1px solid #DFE0EB",
}));

// Row component that handles the expand/collapse functionality
const ExpandableRow = ({ row, columns, index, totalRows, onRowClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        key={row?.key || row?.id || index}
        sx={{
          cursor: "pointer",
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
          "&:hover": {
            backgroundColor: "#b2e4f9",
          },
        }}
        onDoubleClick={(event) => {
          // Don't trigger row click when clicking the expand button
          if (!event.target.closest(".expand-button")) {
            onRowClick && onRowClick(row?.id, row);
          }
        }}
      >
        {/* Add expand/collapse button if row has description */}
        {row.description && (
          <TableCell padding="checkbox">
            <IconButton
              className="expand-button"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}

        {_.map(columns, (column, indexColumn) => {
          return (
            <TableCell
              {...(column?.columnCell ?? {})}
              key={indexColumn}
              style={{
                borderBottom:
                  index !== totalRows - 1 || open
                    ? "1px solid rgba(224, 224, 224, 1)"
                    : "",
              }}
            >
              <CellContent
                row={row}
                render={column?.render}
                fieldName={column?.fieldName}
              />
            </TableCell>
          );
        })}
      </TableRow>

      {/* Description Row */}
      {row.description && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ paddingTop: 2, paddingBottom: 6 }}>
                {row.description}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const CoreTable = ({
  className,
  data,
  columns,
  page = 0,
  size = 20,
  totalPages,
  paginationHidden,
  isLoading,
  isShowColumnStt = false,
  maxHeight,
  isShowNoDataText = true,
  actionTable,
  stickyHeader = false,
  tableHead,
  onChangePageSize,
  onRowClick,
}) => {
  const dataColumn = isShowColumnStt
    ? [
        {
          header: translate("table.no"),
          fieldName: "index",
        },
        ...columns,
      ]
    : columns;

  if (isShowColumnStt) {
    data = data.map((item, index) => {
      const noNumber = page * size + index + 1;
      return {
        ...item,
        index: noNumber > 9 ? noNumber : `0${noNumber}`,
      };
    });
  }

  const columnsChecked = dataColumn;
  // Check if any rows have descriptions to determine if we need an extra column for expand/collapse
  const hasDescriptions = data.some((row) => !!row.description);

return (
    <div className={className} style={{ position: "relative" }}>
        <TableContainerCommon
            style={{
                maxHeight: `${maxHeight}px`,
            }}
        >
            <Table
                aria-label="sticky table"
                stickyHeader={stickyHeader}
                sx={{ minWidth: 650 }}
            >
                {tableHead || (
                    <TableHeadCommon>
                        <TableRow>
                            {/* Add an empty header cell for the expand/collapse button column */}
                            {hasDescriptions && (
                                <TableCell
                                    style={{ width: "48px", backgroundColor: "#f0f3f7" }}
                                />
                            )}

                            {_.map(columnsChecked, (column, index) => (
                                <TableCell
                                    variant="head"
                                    key={index}
                                    {...(column?.styleCell ?? {})}
                                    style={{
                                        paddingTop: "1rem",
                                        paddingBottom: "1rem",
                                        minWidth: index !== 0 ? 200 : 60,
                                        fontWeight: 600,
                                        backgroundColor: "#f0f3f7",
                                        ...column?.styleCell?.style,
                                    }}
                                >
                                    {column?.header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeadCommon>
                )}

                <TableBody>
                    {isLoading &&
                        Array.from({ length: 5 }).map((_, idx) => (
                            <TableRowLoading
                                key={idx}
                                colSpan={
                                    hasDescriptions
                                        ? columnsChecked.length + 1
                                        : columnsChecked.length
                                }
                            />
                        ))}

                    {!isLoading && data?.length === 0 && (
                        <TableRowEmpty
                            colSpan={
                                hasDescriptions
                                    ? columnsChecked.length + 1
                                    : columnsChecked.length
                            }
                            isShowNoDataText={isShowNoDataText}
                        />
                    )}

                    {!isLoading &&
                        _.map(data, (row, index) => (
                            <ExpandableRow
                                key={row?.key || row?.id || index}
                                row={row}
                                columns={columnsChecked}
                                index={index}
                                totalRows={data.length}
                                onRowClick={onRowClick}
                            />
                        ))}

                    {actionTable}
                </TableBody>
            </Table>
        </TableContainerCommon>

        {!paginationHidden && (
            <div className="py-5">
                <CorePagination
                    size={size ?? 20}
                    page={page ?? 1}
                    totalPages={totalPages ?? 1}
                    onChangePagination={(val) =>
                        onChangePageSize && onChangePageSize(val)
                    }
                />
            </div>
        )}
    </div>
);
};

CoreTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  page: PropTypes.number,
  size: PropTypes.number,
  totalPages: PropTypes.number,
  paginationHidden: PropTypes.bool,
  isLoading: PropTypes.bool,
  isShowColumnStt: PropTypes.bool,
  maxHeight: PropTypes.number,
  isShowNoDataText: PropTypes.bool,
  actionTable: PropTypes.node,
  stickyHeader: PropTypes.bool,
  tableHead: PropTypes.node,
  onChangePageSize: PropTypes.func,
  onRowClick: PropTypes.func,
};

ExpandableRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  onRowClick: PropTypes.func,
};

export default CoreTable;

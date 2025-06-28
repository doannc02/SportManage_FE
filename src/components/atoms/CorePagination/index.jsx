/* eslint-disable react-hooks/exhaustive-deps */
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Pagination, PaginationItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CoreInput from "../CoreInput";
import { toastError } from "../../../helpers/toast";
import { Select } from "@chakra-ui/react";
// import PropTypes from 'prop-types'

const CoreTablePagination = (props) => {
  const { page, size, totalPages, onChangePagination, onChangePageSize, onChangeJumpToPage } = props;
  const [rowPerPages, setRowPerPages] = useState(size ?? 10);
  const [currentPage, setCurrentPage] = useState(() =>
    typeof page === "number" ? page + 1 : 1
  );

  const pageSizeOptions = [10, 20, 50, 100];


  const { control, getValues, setValue } = useForm({
    defaultValues: {
      jump_to_page: Number(page + 1) ?? null,
    },
  });

  useEffect(() => {
    setValue("jump_to_page", currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(page ? page + 1 : 1);
  }, [page]);

  useEffect(() => {
    if (size) {
      setRowPerPages(size);
    }
  }, [size]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        gap: 2,
        marginTop: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='body2'>Số trang</Typography>
        <Select
          value={rowPerPages}
          onChange={onChangePageSize}
          width="90px"
          height="35px"
          fontSize="sm"
          padding="0 8px"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>
      <Box
        // sx={{
        //   width: "100%",
        //   display: "flex",
        //   alignItems: "center",
        //   justifyContent: "center",
        // }}
      >
        <Pagination
          color="primary"
          onChange={onChangePagination}
          // siblingCount={1}
          page={currentPage ?? 1}
          count={totalPages}
          showFirstButton
          showLastButton
          renderItem={(item) => {
            return (
              <PaginationItem
                slots={{
                  last: KeyboardDoubleArrowRightIcon,
                  first: KeyboardDoubleArrowLeftIcon,
                }}
                {...item}
              />
            );
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ paddingRight: 2 }} variant='body2'>
          Nhảy tới trang
        </Typography>
        <CoreInput
          variant='outlined'
          control={control}
          type='number'
          name='jump_to_page'
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              const toPage = getValues('jump_to_page')
              if (toPage <= totalPages && toPage > 0) {
                onChangeJumpToPage(toPage - 1)
                setCurrentPage(toPage)                
              } else {
                toastError('Trang không tồn tại')
              }
            }
          }}
          onBlur={() => setValue('jump_to_page', currentPage)}
          sx={{
            width: '70px',
            fontSize: '0.875rem',
            '& .MuiInputBase-root': {
              height: '35px',
              minHeight: '35px',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(CoreTablePagination);

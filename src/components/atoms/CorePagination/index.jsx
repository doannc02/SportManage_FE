/* eslint-disable react-hooks/exhaustive-deps */
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import {
  Box,
  Pagination,
  PaginationItem,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import CoreInput from '../CoreInput'
import { toastError } from '../../../helpers/toast'
import { Select } from '@chakra-ui/react'
// import PropTypes from 'prop-types'

const CoreTablePagination = (props) => {
  const { page, size, totalPages, onChangePagination } = props
  const [rowPerPages, setRowPerPages] = useState(size ?? 10)
  const [currentPage, setCurrentPage] = useState(Number(page + 1) ?? 1)

  const pageSizeOptions = [10, 20, 50, 100]

  console.log(page, size, totalPages, currentPage, rowPerPages, 'logzzz')

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      jump_to_page: Number(page + 1) ?? null,
    },
  })

  useEffect(() => {
    setValue('jump_to_page', currentPage)
  }, [currentPage])

  useEffect(() => {
    setCurrentPage(page ? page + 1 : 1)
  }, [page])

  useEffect(() => {
    if (size) {
      setRowPerPages(size)
    }
  }, [size])

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        gap: 2,
        marginTop: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='body2'>Trang số</Typography>
        <Select
          value={rowPerPages}
          onChange={(e) => {
            const selectedSize = parseInt(e.target.value, 10)
            setRowPerPages(selectedSize)
            onChangePagination({ page: 0, size: selectedSize })
          }}
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
      <Box>
        <Pagination
          color='primary'
          onChange={(e, value) => {
            setCurrentPage(value)
            onChangePagination({
              size: rowPerPages,
              page: value - 1,
            })
          }}
          siblingCount={1}
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
            )
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
                onChangePagination({
                  size: rowPerPages,
                  page: toPage - 1,
                })
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
  )
}

export default React.memo(CoreTablePagination)

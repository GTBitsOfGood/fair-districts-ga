import React, { useEffect, useMemo, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Flex, Heading, IconButton, Box, HStack, Center } from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useTable } from 'react-table'
import LegislatorAddModal from "../components/LegislatorAddModal";
import LegislatorEditModal from "../components/LegislatorEditModal";
import axios from "axios";
import LegislatorDeleteDialog from "../components/LegislatorDeleteDialog";

const Legislator = () => {
  const [ legislators, setLegislators ] = useState([]);
  const [ legislatorIndex, setLegislatorIndex ] = useState(0);
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        Cell: ({ row }) => (
          <Center>
            <HStack spacing='24px'>
              <IconButton
                onClick={() => {
                  setLegislatorIndex(row.index);
                  onEditOpen();
                }}
                icon={<EditIcon />}
                size="sm"
                variant="outline"
                colorScheme="black"
              />
              <IconButton
                onClick={() => {
                  setLegislatorIndex(row.index);
                  onDeleteOpen();
                }}
                icon={<DeleteIcon />}
                size="sm"
                variant="outline"
                colorScheme="red"
              />
            </HStack>
          </Center>
        ),
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Party',
        accessor: 'party',
      },
      {
        Header: 'Counties',
        accessor: 'counties'
      }
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: legislators });

  useEffect(() => {
    async function initLegislators() {
      const res = await axios.get("/api/legislator");
      const legislators = res.data;
      legislators.forEach((legislator) => legislator.counties = legislator.counties.map((county) => county.name).join(", "));
      setLegislators(legislators);
    }
    initLegislators();
  }, []);

  return (
    <Box p={8}>
      <Flex direction="row" justifyContent="space-between">
        <Heading>Legislators</Heading>
        <IconButton colorScheme="teal" icon={<AddIcon />} onClick={onAddOpen} />
      </Flex>
      <LegislatorAddModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          legislators={legislators}
          setLegislators={setLegislators}
      />
      <LegislatorEditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        legislatorIndex={legislatorIndex}
        legislators={legislators}
        setLegislators={setLegislators}
      />
      <LegislatorDeleteDialog
        alertOpen={isDeleteOpen}
        onClose={onDeleteClose}
        legislatorIndex={legislatorIndex}
        legislators={legislators}
        setLegislators={setLegislators}
      />
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, ind) => (
            <Tr key={ind} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, ind2) => (
                <Th key={ind2}
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, ind) => {
            prepareRow(row)
            return (
              <Tr key={ind} {...row.getRowProps()}>
                {row.cells.map((cell, ind2) => (
                  <Td key={ind2} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}


export default Legislator
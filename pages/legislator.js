import React, { useEffect, useMemo, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Flex, Heading, IconButton, Box, HStack, Center } from '@chakra-ui/react'
import { AddIcon, EditIcon } from '@chakra-ui/icons'
import { useTable, useRowSelect } from 'react-table'
import LegislatorAddModal from "../components/LegislatorAddModal";
import LegislatorEditModal from "../components/LegislatorEditModal";
import axios from "axios";
import NavBar from "../components/NavBar";
import { useSession } from "next-auth/react"
import AccessDeniedPage from "../components/AccessDeniedPage";
import Loader from '../components/Loader';

const Legislator = () => {
  const { data: session } = useSession();
  const [ legislators, setLegislators ] = useState([]);
  const [ legislatorIndex, setLegislatorIndex ] = useState(0);
  const [ isLoading,  setLoading ] = useState(true);

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

  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        width: 60,
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
    [onEditOpen],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: legislators }, useRowSelect);

  useEffect(() => {
    async function initLegislators() {
      const res = await axios.get("/api/legislator");
      const legislators = res.data;
      legislators.forEach((legislator) => legislator.counties = legislator.counties.map((county) => county.name).join(", "));
      setLegislators(legislators);
      setTimeout(() => {
        setLoading(false);
      }, 100)

    }
    initLegislators();
  }, []);

  if (!session) {
    return <AccessDeniedPage />
  }

  if (isLoading) {
    return (
      <Flex direction="row">
        <NavBar session={session}/>
        <Box p={8} flex="1">
          <Loader/>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="row">
      <NavBar session={session}/>
      <Box p={8} flex="1">
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
        <Table {...getTableProps()} variant="striped" size="md">
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
    </Flex>
  )
}


export default Legislator
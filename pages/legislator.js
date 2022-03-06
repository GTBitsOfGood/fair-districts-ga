import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Flex,
  Heading,
  IconButton,
  Box,
  HStack,
  Center,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useTable, useRowSelect } from "react-table";
import LegislatorAddModal from "../components/LegislatorAddModal";
import LegislatorEditModal from "../components/LegislatorEditModal";
import axios from "axios";
import NavBar from "../components/NavBar";
import { getSession, useSession } from "next-auth/react";
import AccessDeniedPage from "../components/AccessDeniedPage";

const Legislator = ({ data }) => {
  const { data: session } = useSession();
  const [legislators, setLegislators] = useState(data);
  const [legislatorIndex, setLegislatorIndex] = useState(0);
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
        Cell: ({ row: { index } }) => (
          <Center>
            <HStack spacing="24px">
              <IconButton
                onClick={() => {
                  setLegislatorIndex(index);
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
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Party",
        accessor: "party",
      },
      {
        Header: "Counties",
        accessor: "counties",
        Cell: ({
          row: {
            values: { counties },
          },
        }) => <div>{counties.map((c) => c.name).join(", ")}</div>,
      },
    ],
    [onEditOpen]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: legislators }, useRowSelect);

  if (!session) {
    return <AccessDeniedPage />;
  }

  return (
    <Flex direction="row">
      <NavBar session={session} />
      <Box p={8} flex="1">
        <Flex direction="row" justifyContent="space-between">
          <Heading>Legislators</Heading>
          <IconButton
            colorScheme="teal"
            icon={<AddIcon />}
            onClick={onAddOpen}
          />
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
                  <Th key={ind2} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row, ind) => {
              prepareRow(row);
              return (
                <Tr key={ind} {...row.getRowProps()}>
                  {row.cells.map((cell, ind2) => (
                    <Td key={ind2} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export async function getServerSideProps(context) {
  const res = await axios.get(
    `http://${
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : "localhost:3000"
    }/api/legislator`
  );
  const data = await res.data;
  return {
    props: {
      session: await getSession(context),
      data,
    },
  };
}

export default Legislator;

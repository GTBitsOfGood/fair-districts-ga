import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import React, { useMemo } from "react";
import AccessDeniedPage from "../components/AccessDeniedPage";
import NavBar from "../components/NavBar";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Flex,
  IconButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { useTable, useRowSelect } from "react-table";

const County = ({ data }) => {
  const { data: session } = useSession();

  const tableCols = useMemo(
    () => [
      {
        Header: "County",
        accessor: "name",
      },
      {
        Header: "# Legislators",
        accessor: "numLegislators",
        Cell: ({
          row: {
            values: { legislators },
          },
        }) => <div>{legislators.length}</div>,
      },
      {
        Header: "Legislators",
        accessor: "legislators",
        Cell: ({
          row: {
            values: { legislators },
          },
        }) => (
          <Stack direction="column">
            {legislators.map((l) => (
              <div>{`${l.firstName} ${l.lastName}`}</div>
            ))}
          </Stack>
        ),
      },
      {
        Header: "# Volunteers",
        accessor: "numVolunteers",
        Cell: ({
          row: {
            values: { volunteers },
          },
        }) => <div>{volunteers.length}</div>,
      },
      {
        Header: "Volunteers",
        accessor: "volunteers",
        Cell: ({
          row: {
            values: { volunteers },
          },
        }) => (
          <Stack>
            {volunteers.map((v) => (
              <div>{`${v.first_name} ${v.last_name}`}</div>
            ))}
          </Stack>
        ),
      },
      {
        Header: "# Newspapers",
        accessor: "numNewspapers",
        Cell: ({
          row: {
            values: { newspapers },
          },
        }) => <div>{newspapers.length}</div>,
      },
      {
        Header: "Newpapers",
        accessor: "newspapers",
        Cell: ({
          row: {
            values: { newspapers },
          },
        }) => (
          <Stack>
            {newspapers.map((n) => (
              <div>{n.name}</div>
            ))}
          </Stack>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: tableCols, data: data });

  if (!session) {
    return <AccessDeniedPage />;
  }

  return (
    <Flex direction="row">
      <NavBar session={session} />
      <Box p={8} flex="1">
        <Heading>Counties</Heading>
        <Table {...getTableProps()} variant="striped" size="md">
          <Thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } =
                headerGroup.getHeaderGroupProps();
              return (
                <Tr key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((col) => {
                    const { key, ...restColumn } = col.getHeaderProps();
                    return (
                      <Th key={key} {...restColumn}>
                        {col.render("Header")}
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </Thead>
          <Tbody {...getTableProps()}>
            {rows.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <Tr key={key} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <Td key={key} {...restCellProps}>
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
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
    }/api/county`
  );
  const data = await res.data;
  return {
    props: {
      session: await getSession(context),
      data,
    },
  };
}

export default County;

import React, { useEffect, useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import VolunteerAddModal from "../components/VolunteerAddModal";
import VolunteerEditModal from "../components/VolunteerEditModal";
import { useTable, useRowSelect } from "react-table";
import { getSession, useSession } from "next-auth/react";
import NavBar from "../components/NavBar";

const Volunteer = ({ data }) => {
  const { data: session } = useSession();

  const tableCols = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setVolunteerToEdit({
                index: row.index,
                volunteer: row.original,
              });
              onEditOpen();
            }}
            icon={<EditIcon />}
            size="sm"
            variant="outline"
            colorScheme="black"
          />
        ),
      },
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "County",
        accessor: "county",
        Cell: ({
          row: {
            values: { county },
          },
        }) => <div>{county.name}</div>,
      },
      {
        Header: "Comments",
        accessor: "comments",
      },
      {
        Header: "Submitter",
        accessor: "submitter",
      },
      {
        Header: "Writer",
        accessor: "writer",
      },
      {
        Header: "Assignments",
        accessor: "assignments",
        Cell: ({
          row: {
            values: { assignments },
          },
        }) => <div>{assignments.map((a) => a.name).join(", ")}</div>,
      },
    ],
    []
  );

  const [volunteers, setVolunteers] = useState(data);
  const [volunteerToEdit, setVolunteerToEdit] = useState();
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
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: tableCols, data: volunteers }, useRowSelect);

  return (
    <Flex direction="row">
      <NavBar session={session} />
      <Box p={8} flex="1">
        <Flex direction="row" justifyContent="space-between">
          <Heading>Volunteers</Heading>
          <IconButton
            colorScheme="teal"
            icon={<AddIcon />}
            onClick={onAddOpen}
          />
        </Flex>
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
        <VolunteerAddModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          volunteers={volunteers}
          setVolunteers={setVolunteers}
        />
        <VolunteerEditModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          volunteerMeta={volunteerToEdit}
          volunteers={volunteers}
          setVolunteers={setVolunteers}
        />
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
    }/api/volunteer`
  );
  const data = await res.data;
  return {
    props: {
      session: await getSession(context),
      data,
    },
  };
}

export default Volunteer;

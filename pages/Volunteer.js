import React, {useEffect, useMemo, useState} from "react";
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

const Volunteer = () => {
    const {data: session} = useSession();
    const {volunteers, setVolunteers} = userState([]);
    const {volIndex, setVolIndex} = useState(0);
 
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
                  newspaper: row.original,
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
          }) => <div>{assignments.map((a) => c.name).join(", ")}</div>,
        },
      ],
      []
    );

    /*
    model Volunteer {
        id String @id @default(cuid())
        first_name String
        last_name String
        email String @unique
        phone String?
        county County @relation(fields: [countyId], references: [id])
        countyId String
        comments String?
        submitter Boolean? @default(false)
        writer Boolean? @default(false)
        tracker Boolean? @default(false)
        assignments Assignment[]
      }
    */

    return (
        "Volunteer"
    );
}

export default Volunteer;

/*
const Newspaper = ({ data }) => {
  const tableCols = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setNewspaperToEdit({
                index: row.index,
                newspaper: row.original,
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
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Website",
        accessor: "website",
      },
      {
        Header: "Instagram",
        accessor: "instagram",
      },
      {
        Header: "Twitter",
        accessor: "twitter",
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
    []
  );
  const [newspapers, setNewspapers] = useState(data);
  const [newspaperToEdit, setNewspaperToEdit] = useState();
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
    useTable({ columns: tableCols, data: newspapers }, useRowSelect);

  return (
    <Box p={8}>
      <Flex direction="row" justifyContent="space-between">
        <Heading>Newspapers</Heading>
        <IconButton colorScheme="teal" icon={<AddIcon />} onClick={onAddOpen} />
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
      <NewspaperAddModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        newspapers={newspapers}
        setNewspapers={setNewspapers}
      />
      <NewspaperEditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        newspaperMeta={newspaperToEdit}
        newspapers={newspapers}
        setNewspapers={setNewspapers}
      />
    </Box>
  );
};

export async function getServerSideProps() {
  const res = await axios.get(
    `http://${
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : "localhost:3000"
    }/api/newspaper`
  );
  const data = await res.data;
  return { props: { data } };
}

export default Newspaper;
*/
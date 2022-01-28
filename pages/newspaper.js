import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Editable,
  EditableInput,
  EditablePreview,
  Heading,
  Flex,
  IconButton,
  useDisclosure,
  chakra,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import NewspaperModal from "../components/NewspaperModal";
import axios from "axios";
import { useTable } from "react-table";

const tableHeadings = [
  "Name",
  "Email",
  "Rating",
  "Description",
  "Website",
  "Instagram",
  "Twitter",
];

const Newspaper = () => {
  const tableCols = useMemo(
    () => [
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
    ],
    []
  );
  const [newspapers, setNewspapers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: tableCols, data: newspapers });

  useEffect(async () => {
    const res = await axios.get("/api/newspaper");
    setNewspapers(await res.data);
  }, []);

  return (
    <Box p={8}>
      <Flex direction="row" justifyContent="space-between">
        <Heading>Newspapers</Heading>
        <IconButton colorScheme="teal" icon={<AddIcon />} onClick={onOpen} />
      </Flex>
      <Table {...getTableProps()} variant="striped" size="md">
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Th width="200px" {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <NewspaperModal
        isOpen={isOpen}
        onClose={onClose}
        newspapers={newspapers}
        setNewspapers={setNewspapers}
      />
    </Box>
  );
};

export default Newspaper;

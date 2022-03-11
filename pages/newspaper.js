import React, { useMemo, useState, useEffect } from "react";
import Router from "next/router";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Heading,
  Flex,
  IconButton,
  useDisclosure,
  Center
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import NewspaperAddModal from "../components/NewspaperAddModal";
import axios from "axios";
import { useTable, useRowSelect } from "react-table";
import NewspaperEditModal from "../components/NewspaperEditModal";
import { getSession, useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import AccessDeniedPage from "../components/AccessDeniedPage";
import Loader from '../components/Loader';
import TableHeader from "../components/TableHeader";
import useDebounce from "../components/hooks/useDebounce";



const Newspaper = () => {
  const { data: session } = useSession();
  const [ isLoading,  setLoading ] = useState(true);
  const [newspapers, setNewspapers] = useState([]);
  const [newspaperToEdit, setNewspaperToEdit] = useState();
  const [ activeSort, setActiveSort ] = useState('')
  const debouncedActiveSort = useDebounce(activeSort, 200)
  const toggleActiveSort = (target) => {
    const [sort, order] = activeSort.split('.')
    if (sort === undefined || order === undefined) {
      setActiveSort(`${target}.desc`)
      return
    }
    if (target === sort) {
      if (order === 'desc') setActiveSort(`${target}.asc`)
      else setActiveSort('')
    } else setActiveSort(`${target}.desc`)
  }

  useEffect(() => {
    const initPapers = async () => {
      setLoading(true)
      const res = await axios.get(
        `http://${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_VERCEL_URL
            : "localhost:3000"
        }/api/newspaper?order_by=${debouncedActiveSort}`
      );
      const data = await res.data;
      setNewspapers(data)
      setLoading(false)
    }
    initPapers()
  }, [debouncedActiveSort])

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
        Cell: ({
          row: {
            values: { description },
          },
        }) => (
          <div style={{ whiteSpace: "break-spaces", overflowWrap: "anywhere" }}>
            {description}
          </div>
        ),
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

  if (!session) {
    return <AccessDeniedPage />
  }

  return (
    <Flex direction="row">
      <NavBar session={session} />
      <Box p={8} flex="1">
        <Flex direction="row" justifyContent="space-between">
          <Heading>Newspapers</Heading>
          <IconButton
            colorScheme="teal"
            icon={<AddIcon />}
            onClick={onAddOpen}
          />
        </Flex>
        <Table {...getTableProps()} size="md">
          <TableHeader 
            headerGroups={headerGroups} 
            sort={activeSort} 
            toggleSort={toggleActiveSort}
            disabledIndices={[8]}
          />
          <Tbody {...getTableProps()}>
            {!isLoading && rows.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              return (
                <Tr key={key} {...restRowProps} _even={{ bgColor: 'gray.100' }}>
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
        {isLoading && <Loader /> }
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
    </Flex>
  );
};

export default Newspaper;

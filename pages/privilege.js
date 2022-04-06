import React, { useMemo, useState, useEffect } from "react";
import Router from "next/router";

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
  Center,
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import PrivilegeAddModal from "../components/PrivilegeAddModal";
import axios from "axios";
import { useTable, useRowSelect } from "react-table";
import PrivilegeEditModal from "../components/PrivilegeEditModal";
import { getSession, useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import AccessDeniedPage from "../components/AccessDeniedPage";
import Loader from "../components/Loader";
import adminEmails from "./api/auth/adminEmails";
import TableHeader from "../components/TableHeader";
import useDebounce from "../components/hooks/useDebounce";

const Privileges = () => {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState("");
  const [specialUsers, setSpecialUsers] = useState([]);
  const [specialUserIndex, setSpecialUserIndex] = useState(0);

  const debouncedActiveSort = useDebounce(activeSort, 200);
  const toggleActiveSort = (target) => {
    const [sort, order] = activeSort.split(".");
    if (sort === undefined || order === undefined) {
      setActiveSort(`${target}.desc`);
      return;
    }
    if (target === sort) {
      if (order === "desc") setActiveSort(`${target}.asc`);
      else setActiveSort("");
    } else setActiveSort(`${target}.desc`);
  };

  useEffect(() => {
    async function initSpecialUsers() {
      setLoading(true);
      const res = await axios.get(
        `/api/specialUser?order_by=${debouncedActiveSort}`
      );
      const data = res.data;
      setSpecialUsers(data);
      setLoading(false);
    }
    initSpecialUsers();
  }, [debouncedActiveSort]);

  const tableCols = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        Cell: ({ row: { index } }) => (
          <IconButton
            onClick={() => {
              setSpecialUserIndex(index);
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
        Header: "Email",
        accessor: "email",
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
    useTable({ columns: tableCols, data: specialUsers }, useRowSelect);

  if (!session) {
    return <AccessDeniedPage />;
  } else {
    if (!adminEmails.includes(session.user.email)) {
      return <AccessDeniedPage />;
    }
  }

  return (
    <Flex direction="row" height="100%">
      <NavBar session={session} />
      <Box p={8} flex="1" overflowY="auto">
        <Flex direction="row" justifyContent="space-between">
          <Heading>Special Users</Heading>
          <IconButton
            colorScheme="teal"
            icon={<AddIcon />}
            onClick={onAddOpen}
          />
        </Flex>
        <Table {...getTableProps()} variant="striped" size="md">
          <TableHeader
            headerGroups={headerGroups}
            sort={activeSort}
            toggleSort={toggleActiveSort}
          />
          <Tbody {...getTableProps()}>
            {!isLoading &&
              rows.map((row) => {
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
        {isLoading && <Loader />}
        <PrivilegeAddModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          privileges={specialUsers}
          setPrivileges={setSpecialUsers}
        />
        <PrivilegeEditModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          privileges={specialUsers}
          privilegeIndex={specialUserIndex}
          setPrivileges={setSpecialUsers}
        />
      </Box>
    </Flex>
  );
};

export default Privileges;

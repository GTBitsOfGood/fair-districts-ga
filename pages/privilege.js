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
  Center
} from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import PrivilegeAddModal from "../components/PrivilegeAddModal";
import axios from "axios";
import { useTable, useRowSelect } from "react-table";
import PrivilegeEditModal from "../components/PrivilegeEditModal";
import { getSession, useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import AccessDeniedPage from "../components/AccessDeniedPage";
import Loader from '../components/Loader';
import adminEmails from "./api/auth/adminEmails";



const Privileges = ({ specialUsers }) => {
  
  const { data: session } = useSession();
  const [ isLoading,  setLoading ] = useState(true);

  useEffect(() => {
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeComplete", end);
   
  }, [])

  const tableCols = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setPrivilegeToEdit({
                index: row.index,
                privilege: row.original,
              });
              setTimeout(() =>console.log(privilegeToEdit), 5*1000)
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
  const [privileges, setPrivileges] = useState(specialUsers);
  const [privilegeToEdit, setPrivilegeToEdit] = useState();
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
    useTable({ columns: tableCols, data: privileges }, useRowSelect);

  if (!session) {
    return <AccessDeniedPage />
  } else {
    if (!adminEmails.includes(session.user.email)) {
      return <AccessDeniedPage />
    }
  }

  return (
    <Flex direction="row"  height="100%">
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
        <PrivilegeAddModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          privileges={privileges}
          setPrivileges={setPrivileges}
        />
        <PrivilegeEditModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          privilegeMeta={privilegeToEdit}
          privileges={privileges}
          setPrivileges={setPrivileges}
        />
      </Box>
    </Flex>
  );
};

export async function getServerSideProps(context) {
  const resSpecialUsers = await axios.get(
    `http://${
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : "localhost:3000"
    }/api/specialUser`
  );
  const specialUsers = resSpecialUsers.data;

  return {
    props: {
      session: await getSession(context),
      specialUsers,
    },
  };
}

export default Privileges;

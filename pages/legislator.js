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
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";
import adminEmails from "./api/auth/adminEmails";
import TableHeader from "../components/TableHeader";
import useDebounce from "../components/hooks/useDebounce";

const Legislator = () => {
  const { data: session } = useSession();
  const [legislators, setLegislators] = useState([]);
  const [legislatorIndex, setLegislatorIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState("");
  const [specialUsers, setSpecialUsers] = useState([]);

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

  const fetchLegislators = async () => {
    const production = process.env.NODE_ENV === "production";
    let res;
    if (!production) {
      res = await axios.get("http://localhost:3000/api/legislator");
    } else {
      res = await axios.get(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/legislator`)
    }

    const data = await res.data;
    return data;
  }    

  const searchLegislators = async (event) => {
    // Empty search input
    if (!event.target.value) {
      setSearchInput("");
      const data = await fetchLegislators();
      setLegislators(data);

    } else {
      setSearchInput(event.target.value);
      const data = await fetchLegislators();

      const filteredLegislators = data.filter((legislator) => {
        return (
          legislator.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
          legislator.lastName.toLowerCase().includes(searchInput.toLowerCase())
        );
      });
      setLegislators(filteredLegislators);
    }
  };

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
        Header: "Zip Code",
        accessor: "zip_code"
      },
      {
        Header: "Senator",
        accessor: "isSenator",
        Cell: ({
          row: {
            values: { isSenator },
          },
        }) => <div>{isSenator ? "Yes" : ""}</div>,
      },
      {
        Header: "Representative",
        accessor: "isRepresentative",
        Cell: ({
          row: {
            values: { isRepresentative },
          },
        }) => <div>{isRepresentative ? "Yes" : ""}</div>,
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
      }
    ],
    [onEditOpen]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: legislators }, useRowSelect);

  useEffect(() => {
    async function initLegislators() {
      setLoading(true);
      const res = await axios.get(
        `/api/legislator?order_by=${debouncedActiveSort}`
      );
      const legislators = res.data;
      setLegislators(legislators);
      let resSpecialUsers = await axios.get(`/api/specialUser`);
      resSpecialUsers = resSpecialUsers.data.map((u) => u.email);
      setSpecialUsers(resSpecialUsers);
      setLoading(false);
    }
    initLegislators();
  }, [debouncedActiveSort]);

  if (!session) {
    return <AccessDeniedPage />;
  } else {
    if (!adminEmails.includes(session.user.email)) {
      if (!specialUsers.includes(session.user.email)) {
        return <AccessDeniedPage />;
      }
    }
  }
  
  console.log(headerGroups);

  return (
    <Flex direction="row" height="100%">
      <NavBar session={session} />
      <Box p={8} flex="1" overflowY={"auto"} overflowX={"auto"}>
        <Flex direction="row" justifyContent="space-between">
          <Heading>Legislators</Heading>
          <Flex direction="row">
          <SearchBar onChange={searchLegislators} />
            <IconButton
              marginLeft={10}
              colorScheme="blue"
              icon={<AddIcon />}
              onClick={onAddOpen}
            />
          </Flex>
        </Flex>
        <Table {...getTableProps()} size="md">
          <TableHeader
            headerGroups={headerGroups}
            sort={activeSort}
            toggleSort={toggleActiveSort}
            disabledIndices={[4]}
          />
          <Tbody {...getTableBodyProps()}>
            {!isLoading &&
              rows.map((row, ind) => {
                prepareRow(row);
                return (
                  <Tr
                    key={ind}
                    {...row.getRowProps()}
                    _even={{ bgColor: "gray.100" }}
                  >
                    {row.cells.map((cell, ind2) => (
                      <Td key={ind2} {...cell.getCellProps()} maxWidth={14}>
                        {cell.render("Cell")}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
        {isLoading && <Loader />}
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
      </Box>
    </Flex>
  );
};

export default Legislator;

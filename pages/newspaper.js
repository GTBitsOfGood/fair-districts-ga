import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box, Flex, Heading, IconButton, Table, Tbody, Td, Tr, useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import { useRowSelect, useTable } from "react-table";
import AccessDeniedPage from "../components/AccessDeniedPage";
import useDebounce from "../components/hooks/useDebounce";
import Loader from '../components/Loader';
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import NewspaperAddModal from "../components/NewspaperAddModal";
import NewspaperEditModal from "../components/NewspaperEditModal";
import TableHeader from "../components/TableHeader";
import adminEmails from "./api/auth/adminEmails";


const Newspaper = () => {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [newspapers, setNewspapers] = useState([]);
  const [newspaperToEdit, setNewspaperToEdit] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [activeSort, setActiveSort] = useState('');
  const [specialUsers, setSpecialUsers] = useState([]);

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
      const res = await axios.get(`/api/newspaper?order_by=${debouncedActiveSort}`);
      const data = await res.data;
      setNewspapers(data)
      let resSpecialUsers = await axios.get(`/api/specialUser`);
      resSpecialUsers = resSpecialUsers.data.map(u => u.email);
      setSpecialUsers(resSpecialUsers);
      setLoading(false)
    }
    initPapers()
  }, [debouncedActiveSort])

  const fetchNewspapers = async () => {
    const res = await axios.get(
      `http://${process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_URL
        : "localhost:3000"
      }/api/newspaper`
    );
    const data = await res.data;
    return data
  }

  const searchNewspapers = async (event) => {
    // Empty search input
    if (!event.target.value) {
      setSearchInput("");
      const data = await fetchNewspapers();
      setNewspapers(data);

    } else {
      setSearchInput(event.target.value);
      const filteredNewspapers = newspapers.filter((newspaper) =>
        newspaper.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setNewspapers(filteredNewspapers);
    }
  };

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
  } else {
    if (!adminEmails.includes(session.user.email)) {
      if (!specialUsers.includes(session.user.email)) {
        return <AccessDeniedPage />
      }
    }
  }

  return (
    <Flex direction="row" height="100%">
      <NavBar session={session} />
      <Box p={8} flex="1">
        <Flex direction="row" justifyContent="space-between">
          <Heading>Newspapers</Heading>
          <Flex direction="row">
            <SearchBar onChange={searchNewspapers} />
            <IconButton
              colorScheme="teal"
              icon={<AddIcon />}
              onClick={onAddOpen}
              marginLeft={5}
            />
          </Flex>
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
        {isLoading && <Loader />}
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

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
import TableHeader from "../components/TableHeader";
import SearchBar from "../components/SearchBar";
import useDebounce from "../components/hooks/useDebounce";
import AccessDeniedPage from "../components/AccessDeniedPage";
import adminEmails from "./api/auth/adminEmails";
import Loader from "../components/Loader";

const Volunteer = () => {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerIndex, setVolunteerIndex] = useState(0);
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


  const fetchVolunteers = async () => {
    const production = process.env.NODE_ENV === "production";
    let res;
    if (!production) {
      res = await axios.get("http://localhost:3000/api/volunteer");
    } else {
      res = await axios.get(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/volunteer`)
    }

    const data = await res.data;
    return data;
  }    

  const searchVolunteers = async (event) => {
    // Empty search input
    if (!event.target.value) {
      setSearchInput("");
      const data = await fetchVolunteers();
      setVolunteers(data);

    } else {
      setSearchInput(event.target.value);
      const data = await fetchVolunteers();

      const filteredVolunteers = data.filter((volunteer) => {
        return (
          volunteer.first_name.toLowerCase().includes(searchInput.toLowerCase()) ||
          volunteer.last_name.toLowerCase().includes(searchInput.toLowerCase())
        );
      });
      setVolunteers(filteredVolunteers);
    }
  };


  useEffect(() => {
    const initVolunteers = async () => {
      setLoading(true);
      const res = await axios.get(
        `/api/volunteer?order_by=${debouncedActiveSort}`
      );
      const data = await res.data;
      setVolunteers(data);
      let resSpecialUsers = await axios.get(`/api/specialUser`);
      resSpecialUsers = resSpecialUsers.data.map((u) => u.email);
      setSpecialUsers(resSpecialUsers);
      setLoading(false);
    };
    initVolunteers();
  }, [debouncedActiveSort]);

  const tableCols = useMemo(
    () => [
      {
        Header: "",
        accessor: "edit",
        Cell: ({ row: { index } }) => (
          <IconButton
            onClick={() => {
              setVolunteerIndex(index);
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
        Header: "Zip Code",
        accessor: "zip_code",
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
        Cell: ({
          row: {
            values: { submitter },
          },
        }) => <div>{submitter ? "Yes" : ""}</div>,
      },
      {
        Header: "Writer",
        accessor: "writer",
        Cell: ({
          row: {
            values: { writer },
          },
        }) => <div>{writer ? "Yes" : ""}</div>,
      },
      {
        Header: "Tracker",
        accessor: "tracker",
        Cell: ({
          row: {
            values: { tracker },
          },
        }) => <div>{tracker ? "Yes" : ""}</div>,
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
      {
        Header: "Quality",
        accessor: "quality",
        Cell: ({
          row: {
            values: { quality },
          },
        }) => <div>{quality ? quality : "NA"}</div>,
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
    useTable({ columns: tableCols, data: volunteers }, useRowSelect);

  if (!session) {
    return <AccessDeniedPage />;
  } else {
    if (!adminEmails.includes(session.user.email)) {
      if (!specialUsers.includes(session.user.email)) {
        return <AccessDeniedPage />;
      }
    }
  }

  return (
    <Flex direction="row"  height="100%">
      <NavBar session={session} />
      <Box p={8} flex="1" width={100} overflowY={"auto"} overflowX={"auto"}>
        <Flex direction="row" justifyContent="space-between">
          <Heading>Volunteers</Heading>
          <Flex direction="row">
          <SearchBar onChange={searchVolunteers} />
            <IconButton
              marginLeft={10}
              colorScheme="blue"
              icon={<AddIcon />}
              onClick={onAddOpen}
            />
          </Flex>
        </Flex>
        <Table {...getTableProps()} size="md" variant="striped">
          <TableHeader
            headerGroups={headerGroups}
            sort={activeSort}
            toggleSort={toggleActiveSort}
            disabledIndices={[4, 5, 10]}
            padding={0}
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
                        <Td key={key} {...restCellProps}  maxWidth={7}>
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
        <VolunteerAddModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          volunteers={volunteers}
          setVolunteers={setVolunteers}
        />
        <VolunteerEditModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          volunteers={volunteers}
          volunteerIndex={volunteerIndex}
          setVolunteers={setVolunteers}
        />
      </Box>
    </Flex>
  );
};

export default Volunteer;

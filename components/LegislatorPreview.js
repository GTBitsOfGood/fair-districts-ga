import React, { useEffect, useMemo, useState } from 'react';
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
  TableContainer,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useTable, useRowSelect } from 'react-table';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AccessDeniedPage from './AccessDeniedPage';
import Loader from './Loader';
import adminEmails from '../pages/api/auth/adminEmails';
import TableHeader from './TableHeader';
import useDebounce from './hooks/useDebounce';

const LegislatorPreview = () => {
  const { data: session } = useSession();
  const [legislators, setLegislators] = useState([]);
  const [legislatorIndex, setLegislatorIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState('');
  const [specialUsers, setSpecialUsers] = useState([]);

  const debouncedActiveSort = useDebounce(activeSort, 200);
  const toggleActiveSort = (target) => {
    const [sort, order] = activeSort.split('.');
    if (sort === undefined || order === undefined) {
      setActiveSort(`${target}.desc`);
      return;
    }
    if (target === sort) {
      if (order === 'desc') setActiveSort(`${target}.asc`);
      else setActiveSort('');
    } else setActiveSort(`${target}.desc`);
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
        Header: '',
        accessor: 'edit',
        width: 60,
        Cell: ({ row: { index } }) => (
          <Center>
            <HStack spacing="24px"></HStack>
          </Center>
        ),
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Party',
        accessor: 'party',
      },
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

  return (
    <Box p={8} display="inline" overflowY="hidden">
      <Flex direction="column" overflowY="hidden">
        <Heading pl="20px" my="0px">
          Legislators
        </Heading>
        <TableContainer overflowY="hidden">
          <Table {...getTableProps()} size="md" overflowY="hidden">
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
                      _even={{ bgColor: 'gray.100' }}
                    >
                      {row.cells.map((cell, ind2) => (
                        <Td key={ind2} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      {isLoading && <Loader />}
    </Box>
  );
};

export default LegislatorPreview;

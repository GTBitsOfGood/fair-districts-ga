import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, Th, Thead, Tr} from "@chakra-ui/react";

const TableHeader = ({ headerGroups, sort, toggleSort, disabledIndices=[] }) => {
  const [ slug, order ] = sort.split('.')
  return (
    <Thead borderBottomWidth={'1.5px'} borderBottomColor={'gray.400'}>
      {headerGroups.map((headerGroup) => {
        const { key, ...restHeaderGroupProps } =
          headerGroup.getHeaderGroupProps();
        return (
          <Tr key={key} {...restHeaderGroupProps}>
            {headerGroup.headers.map((col, i) => {
              const { key, ...restColumn } = col.getHeaderProps();
              let value = 0
              if (slug === col.id) {
                if (order === 'asc') value = 1
                else if (order === 'desc') value = -1
              }
              console.log(i)
              const noToggle = i === 0 || disabledIndices.includes(i)
              return (
                <Th 
                  key={key} 
                  whiteSpace={'nowrap'}
                  _hover={{ bgColor: noToggle ? null : 'gray.100' }}
                  cursor={noToggle ? null : "pointer"}
                  onClick={() => { if (!noToggle) toggleSort(col.id) }}
                  {...restColumn}
                >
                  {col.render("Header")}
                  { !noToggle && <SortIcons order={value} /> }
                </Th>
              );
            })}
          </Tr>
        );
      })}
    </Thead>
  )
}

/**
 * 
 * @param { order: number } order positive for ascending, negative for descending, zero for default
 * @returns icon next to the rows
 */
const SortIcons = ({ order = 0 }) => {
  return (
    <Flex display={'inline-flex'} flexDir={'column'} verticalAlign={'middle'} opacity={order === 0 ? 0.75 : 1} ml={'0.2em'}>
      <TriangleUpIcon h={'0.8em'} opacity={order > 0 ? 1 : 0.3} />
      <TriangleDownIcon h={'0.8em'} opacity={order < 0 ? 1 : 0.3} />
    </Flex>
  )
}

export default TableHeader
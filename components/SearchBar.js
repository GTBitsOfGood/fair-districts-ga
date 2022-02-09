import React from "react";
import {
    Input,
    InputGroup,
    InputLeftElement
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";


const SearchBar = ({ onChange }) => {
    return (
        <InputGroup width={346}>
            <InputLeftElement
                pointerEvents="none"
                children={<FiSearch />}
            />
            <Input
                onChange={onChange}
                placeholder="Search"
            />
        </InputGroup>
    );
};

export default SearchBar;

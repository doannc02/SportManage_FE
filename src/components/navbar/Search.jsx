import React, { useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { AutoComplete, ConfigProvider } from "antd";
import { Search2Icon } from "@chakra-ui/icons";
import { debounce, set } from "lodash";
import { useQueryProductsList } from "../../services/customers/products";

function Search() {
  const [options, setOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { setSearch, search } = useContext(UserContext);
  const handleSearch = () => {
    setSearch(searchInput);
    navigate(`/productpage?q=${searchInput}`);
    console.log("Search initiated:", searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };
  const { data } = useQueryProductsList({
    pageNumber: 0,
    pageSize: 20,
    keyword: search,
  });
  // fetchSuggestions now uses the input value and sets options
  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      try {
        // Assuming useQueryProductsList is a function that returns a promise
        setSearchInput(value);
        setOptions(
          data?.items.map((item) => ({
            value: item.name,
            label: item.name,
          }))
        );
      } catch (e) {
        console.log(e);
      }
    }, 500),
    [data]
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 12,
          colorTextDisabled: "#666D80",
          colorTextPlaceholder: "#666D80",
          colorText: "#666d80",
          fontSize: 16,
        },
      }}
    >
      <AutoComplete
        allowClear
        onInputKeyDown={handleKeyPress}
        options={options}
        className="h-[48px] w-full rounded-[12px] text-[16px] placeholder:text-[#666D80]"
        onSearch={(value) => {
          setSearchInput(value);
          fetchSuggestions(value);
        }}
        placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
        prefix={
          <Search2Icon className="cursor-pointer" onClick={handleSearch} />
        }
        value={searchInput}
        notFoundContent={
          options.length === 0 ? "Không tìm thấy sản phẩm nào" : null
        }
        onClear={() => {
          setSearchInput("");
          setSearch("");
          setOptions([]);
        }}
        onSelect={(value) => {
          setSearch(value);
          setSearchInput(value);
          navigate(`/productpage?q=${value}`);
          setOptions([]);
        }}
      />
    </ConfigProvider>
  );
}

export default Search;

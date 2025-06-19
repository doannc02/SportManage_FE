import { useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { AutoComplete, ConfigProvider } from "antd";
import { Search2Icon } from "@chakra-ui/icons";
import _, { debounce } from "lodash";
import { useQueryProductsList } from "../../services/customers/products";
import { getLabelValueOptions } from "../../helpers/get-label-value-options";
import { Clock8 } from "lucide-react";

const defaultValues = {
  pageNumber: 0,
  pageSize: 5,
  keyword: "",
};
function Search() {
  const [options, setOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [history, setHistory] = useState([]);
  const [queryPage, setQueryPage] = useState(_.omitBy(defaultValues, _.isNil));
  const [debouncedInput, setDebouncedInput] = useState(history[1]);

  const navigate = useNavigate();
  const { setSearch } = useContext(UserContext);
  const handleSearch = () => {
    setSearch(searchInput);
    saveSearchHistory(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };
  useEffect(() => {
    const stored = localStorage.getItem("search_history");
    if (stored) {
      setHistory(getLabelValueOptions(JSON.parse(stored)));
    }
  }, []);

  const saveSearchHistory = (newTerm) => {
    const stored = localStorage.getItem("search_history");
    const prev = stored ? JSON.parse(stored) : [];
    const filtered = prev.filter((item) => item !== newTerm);
    // Thêm giá trị mới lên đầu, chỉ giữ 4 giá trị gần nhất
    const updated = [newTerm, ...filtered].slice(0, 4);
    localStorage.setItem("search_history", JSON.stringify(updated));
    setHistory(getLabelValueOptions(updated));
  };

  const { data } = useQueryProductsList(queryPage);

  const fetchSuggestions = useCallback(
    debounce((value) => {
      setDebouncedInput(value);
    }, 800),
    []
  );
  const getOptions = () => {
    if (searchInput) {
      return options;
    }
    return history;
  };
  const handleSearchInput = (value) => {
    setSearchInput(value);
    fetchSuggestions(value);
  };

  useEffect(() => {
    setQueryPage((prev) => ({
      ...prev,
      keyword: debouncedInput,
      pageNumber: 0,
    }));
  }, [debouncedInput]);

  useEffect(() => {
    setOptions(
      data?.items?.map((item) => ({
        value: item.name,
        label: item.name,
      })) || []
    );
  }, [data]);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          onSearch: { handleSearchInput },
        },
      }}
    >
      <AutoComplete
        size="large "
        allowClear
        onClick={handleSearch}
        onInputKeyDown={handleKeyPress}
        options={getOptions()}
        popupRender={(menu) => (
          <>
            {menu}
            {searchInput === "" && history.length > 0 && (
              <div className="flex justify-end px-3 py-1 text-xs text-gray-500 mt-2 ">
                <span className="flex gap-1 justify-center items-center mx-3">
                  Lịch sử tìm kiếm <Clock8 size={16} strokeWidth={1.5} />
                </span>
              </div>
            )}
          </>
        )}
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
        notFoundContent={options?.length === 0 ? "Đang tải sản phẩm" : null}
        onClear={() => {
          // setSearchInput("");
          setSearch("");
          setOptions([]);
          setHistory([]);
        }}
        onSelect={(value) => {
          setSearch(value);
          setSearchInput(value);
          navigate(`/productpage?q=${value}`);
          setOptions([]);
          saveSearchHistory(value);
        }}
      />
    </ConfigProvider>
  );
}

export default Search;

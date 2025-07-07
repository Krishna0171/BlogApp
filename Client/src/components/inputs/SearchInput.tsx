import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { useEffect, useState, type ChangeEvent } from "react";

type Props = TextFieldProps & {
  setSearchQuery: (searchQuery: string) => void;
};

const SearchInput = ({
  setSearchQuery,
  placeholder = "Search...",
  label = "Search",
  ...rest
}: Props) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  return (
    <TextField
      {...rest}
      placeholder={placeholder}
      label={label}
      id="search-bar"
      className="text"
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
      }}
      variant="outlined"
      size="small"
      margin="normal"
      InputProps={{
        endAdornment: (
          <IconButton>
            {" "}
            <SearchIcon />
          </IconButton>
        ),
      }}
    />
  );
};

export default SearchInput;

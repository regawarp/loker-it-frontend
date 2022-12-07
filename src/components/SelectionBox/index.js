import { MdArrowDropDown } from "react-icons/md";
import Select, { components } from "react-select";

const customStylesSingle = {
  option: (provided, state, base) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#0fb59d" : "white",
    ...base,
    "&:hover": {
      backgroundColor: "#614aa3",
      color: "#ffffff",
    },
  }),
  control: (base, state) => ({
    ...base,
    height: 48,
    minHeight: 48,
    background: "#ffffff",
    // match with the menu
    borderRadius: state.isFocused ? "8px 8px 0 0" : 8,
    // Overwrittes the different states of border
    borderColor: state.isFocused ? "#ece6fb" : "#ece6fb",
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "#e2dcf2" : "#e2dcf2",
    },
    "@media (max-width: 1024px)": {
      ...base["@media (max-width: 1024px)"],
      height: 32,
      minHeight: 32,
      fontSize: "10px",
    },
  }),
  placeholder: (base) => ({
    ...base,
    "@media (max-width: 1024px)": {
      ...base["@media (max-width: 1024px)"],
      fontSize: "10px",
    },
  }),
  menu: (base) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    // beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
    hyphens: "auto",
    // kill the gap
    marginTop: 0,
    textAlign: "left",
    // prevent menu to scroll y
    wordWrap: "break-word",
    zIndex: 9999,
    "@media (max-width: 1024px)": {
      ...base["@media (max-width: 1024px)"],
      fontSize: "10px",
    },
  }),
  menuList: (base) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
  }),

  singleValue: (provided, state) => ({
    ...provided,
    color: "#4a318f",
    fontSize: "12px",
    "@media (max-width: 1024px)": {
      ...provided["@media (max-width: 1024px)"],
      fontSize: "10px",
    },
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#4a318f", // Custom colour
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <MdArrowDropDown className="w-3 h-3 lg:w-6 lg:h-6" />
  </components.DropdownIndicator>
);

const noOptionsMessage = ({ inputValue }) =>
  inputValue.length === 0
    ? "No options"
    : inputValue.length > 0 && inputValue.length < 5
    ? "Type atleast 5 characters"
    : "No results found";

export const SelectionBox = ({
  label,
  placeholder,
  value,
  options,
  handleChange,
  error,
  isClearable,
}) => (
  <div className="w-full flex flex-col gap-1">
    <div className="w-full flex flex-col gap-2">
      <label className="text-xs font-bold text-[#000000]">
        {label}
      </label>
      <Select
        placeholder={
          <div className="placeholder-gray-500 text-xs">
            {placeholder}
          </div>
        }
        value={value}
        options={[...options]}
        onChange={handleChange}
        styles={customStylesSingle}
        components={{ DropdownIndicator }}
        isClearable={isClearable}
      />
    </div>
    <div className={`${!error ? "hidden" : ""}text-red-500 text-xs`}>
      {error ? error : null}
    </div>
  </div>
);

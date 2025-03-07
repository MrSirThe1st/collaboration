import Select from "react-select";
import Flag from "react-world-flags";
import { countries } from "countries-list";
import PropTypes from "prop-types";

const countryOptions = Object.entries(countries).map(([code, country]) => ({
  value: code,
  label: country.name,
  flag: code,
}));

const CustomOption = ({ innerProps, label, data }) => (
  <div
    {...innerProps}
    className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
  >
    <Flag code={data.flag} className="h-4 w-6 object-cover" />
    <span>{label}</span>
  </div>
);

CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  data: PropTypes.shape({
    flag: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const CountrySelect = ({ value, onChange }) => {
  return (
    <Select
      options={countryOptions}
      value={countryOptions.find((option) => option.value === value)}
      onChange={(option) => onChange(option.value)}
      components={{
        Option: CustomOption,
      }}
      placeholder="Select your country"
      className="w-full"
      styles={{
        control: (base) => ({
          ...base,
          padding: "2px",
        }),
      }}
    />
  );
};

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default CountrySelect;

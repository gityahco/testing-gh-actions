import PropTypes from "prop-types";

const menuOptions = [
  { label: "start", value: "start" },
  { label: "end", value: "end" },
  { label: "wall", value: "wall" },
  { label: "empty", value: "empty" },
  { label: "bomb", value: "bomb" },
  { label: "checkpoint", value: "checkpoint" },
];

export default function Menu({ handleCellTypeChange }) {

  const handleButtonClick = (option) => {
    handleCellTypeChange(option);
  };

  return (
    <div className="Menu-buttons">
      {menuOptions.map((option) => (
        <button
          key={option.value}
          className={`menu-button-${option.value}`}
          onClick={() => handleButtonClick(option.value)}
        >
          {option.label}
        </button>
      ))}
      {/* <button onClick={}>start Algo</button> */}
    </div>
  );
}

Menu.propTypes = {
  handleCellTypeChange: PropTypes.func.isRequired,
};

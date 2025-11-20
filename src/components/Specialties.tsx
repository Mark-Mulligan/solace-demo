import { FC, useMemo, useState } from "react";

interface IProps {
  specialtiesList: string[];
}

const SpecialtiesDisplay: FC<IProps> = ({ specialtiesList }) => {
  const [showFullList, setShowFullList] = useState(false);

  const handleClick = () => {
    setShowFullList(!showFullList);
  };

  const displayedList = useMemo(() => {
    if (showFullList) {
      return specialtiesList;
    }

    return specialtiesList.slice(0, 3);
  }, [showFullList, specialtiesList]);

  return (
    <ul>
      {displayedList.map((s, index) => (
        <li key={`${index}-${s}`}>{s}</li>
      ))}

      {specialtiesList.length > 3 && (
        <li>
          <button
            className="underline font-light text-solaceGreen"
            onClick={handleClick}
            type="button"
          >
            {showFullList ? "Show Less" : "Show All"}
          </button>
        </li>
      )}
    </ul>
  );
};

export default SpecialtiesDisplay;

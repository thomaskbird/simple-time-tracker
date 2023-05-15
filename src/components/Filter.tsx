export interface FilterProps {
  label: string;
  onChanged(): void;
}

const Filter = ({ label, onChanged }: FilterProps) => {
  return (
    <span
      className="bg-gray-100 text-xs py-1 px-2.5 mx-1"
      onClick={onChanged}
    >
      {label}
    </span>
  );
};

export default Filter;
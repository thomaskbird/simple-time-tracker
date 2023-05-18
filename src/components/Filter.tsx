import {FilterType} from '~/config/types';

export interface FilterProps {
  filter: FilterType;
  onChanged(): void;
}

const Filter = ({ filter, onChanged }: FilterProps) => {
  const generateLabel = () => {
    switch(filter?.active) {
      case undefined:
        return `${filter?.label} Filter`;
      case true:
        return filter?.label;
      default:
        return `Un${filter?.label}`;
    }
  }
  return (
    <span
      className={`${filter?.active === undefined ? 'bg-gray-100': filter.active ? 'bg-gray-400' : 'bg-rose-300'} text-xs py-1 px-2.5 mx-1 cursor-pointer`}
      onClick={onChanged}
    >
      {generateLabel()}
    </span>
  );
};

export default Filter;
import {FilterType} from '~/config/types';

export interface FilterProps {
  filter: FilterType;
  onChanged(): void;
}

const Filter = ({ filter, onChanged }: FilterProps) => {
  const generateLabel = () => {
    if(filter.type === 'mono') {
      switch(filter?.active) {
        case undefined:
          return filter.labels.notDefined;
        default:
          return filter.labels.truthy;
      }
    } else {
      switch(filter?.active) {
        case undefined:
          return filter.labels.notDefined;
        case true:
          return filter.labels.truthy;
        default:
          return filter.labels.falsy;
      }
    }
  }
  return (
    <span
      className={` bg-white drop-shadow-3xl text-sm py-1 px-2.5 mx-1 cursor-pointer`}
      // drop-shadow-3xl
      onClick={onChanged}
    >
      {generateLabel()}
    </span>
  );
};

export default Filter;
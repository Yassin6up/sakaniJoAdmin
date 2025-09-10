import propType from 'prop-types';

export default function For({ start = 0, end, steps = 1, children }) {
  const result = [];
  for (; start < end; start += steps) {
    result.push(children);
  }
  return result;
}

For.propTypes = {
  start: propType.number,
  end: propType.number.isRequired,
  steps: propType.number,
};

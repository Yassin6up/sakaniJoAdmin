import propType from 'prop-types';

export default function If({ condition = false, children, Component, ...props }) {
  if (Component) return condition ? <Component {...props}>{children}</Component> : '';
  return <>{condition ? children : ''}</>;
}

If.propTypes = {
  condition: propType.bool.isRequired,
  children: propType.element,
  Component: propType.element,
};

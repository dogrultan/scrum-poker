import React from 'react';
import PropTypes from 'prop-types';

import Label from '../Label';

import Wrapper from './Wrapper';
import InputGroup from './InputGroup';

class TextField extends React.Component {
  render() {
    const {
      name,
      label,
      labelInfo,
      className,
      errorText,
      ...restOf
    } = this.props;

    return (
      <Wrapper className={className}>
        {label && <Label htmlFor={name}>{label}</Label>}
        <InputGroup name={name} {...restOf} />
        {errorText && errorText}
      </Wrapper>
    );
  }
}

TextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  labelInfo: PropTypes.string,
  errorText: PropTypes.string,
  className: PropTypes.string
};

export default TextField;

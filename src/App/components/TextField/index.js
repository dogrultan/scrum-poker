import React from 'react';

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

export default TextField;

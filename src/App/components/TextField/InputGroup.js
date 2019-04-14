import React from 'react';
import styled, { css } from 'styled-components';

const field = css`
  outline: none;
  border: 1px solid black;
  border-radius: 3px;
  padding: 12px;
  font-size: 18px;
  font-weight: 600;
  width: ${props => props.width};
  margin: ${props => props.margin};
`;

const Input = styled.input`
  ${field};
`;

const TextArea = styled.textarea`
  ${field};
  width: 100%;
  min-height: 300px;
  margin-bottom: 24px;
`;

class InputGroup extends React.PureComponent {
  render() {
    const { textarea, ...rest } = this.props;
    const Element = textarea ? TextArea : Input;
    return <Element {...rest} />;
  }
}

export default InputGroup;

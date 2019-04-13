import styled, { css, keyframes } from 'styled-components';

const buttonLoadingAnimtionSpin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const loading = css`
  color: rgba(0, 0, 0, 0) !important;

  &::after {
    position: absolute;
    display: block;
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 50%;
    animation: ${buttonLoadingAnimtionSpin} 0.75s linear infinite;
    top: 50%;
    left: 50%;
    margin-top: -9px;
    margin-left: -9px;
  }
`;

const Button = styled.button`
  display: block;
  border-radius: 3px;
  font-weight: bold;
  font-size: 14px;
  padding: 18px 44px;
  outline: none;
  cursor: pointer;
  line-height: 18px;
  transition: all 0.2s;
  user-select: none;
  position: relative;
  margin: ${props => props.centered && '0 auto'};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);

  ${props => props.loading && loading};

  &:hover {
    transition: all 0.2s;
  }

  &:active {
    transition: none;
    box-shadow: none;
  }

  &:disabled {
    cursor: default;
    box-shadow: none;
  }
`;

export default Button;

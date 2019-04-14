import styled from 'styled-components';

const P = styled.p`
  font-size: ${props => (props.small ? '12px' : '18px')};
`;

export default P;

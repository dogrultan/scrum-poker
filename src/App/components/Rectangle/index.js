import styled from 'styled-components';

const Rectangle = styled.div`
  border: 2px solid lightblue;
  border-radius: 6px;
  padding: 18px 24px;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  align-items: center;
  justify-content: center;
  outline: none;
  font-size: 24px;
  font-weight: 600;
  user-select: none;
`;

const SmallRectangle = styled(Rectangle)`
  border: 1px solid ${props => props.selected && 'lightgreen'};
  width: 20px;
  height: 20px;
`;

export default Rectangle;

export { SmallRectangle };

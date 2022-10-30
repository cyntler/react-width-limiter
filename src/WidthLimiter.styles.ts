import styled from 'styled-components';

export const WidthLimiterContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  overflow: hidden;
`;

export const WidthLimiterNodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  position: relative;
`;

export const WidthLimiterNode = styled.div`
  width: auto;
  box-sizing: border-box;
  visibility: hidden;
  opacity: 0;
`;

export const WidthLimiterLeftCounter = styled.p`
  position: absolute;
  margin: 0;
  text-align: right;
  display: flex;
  align-items: center;
  right: 0;
  top: 0;
  width: auto;
  height: 100%;
  font-size: 0.7rem;
  padding: 0 15px;
`;

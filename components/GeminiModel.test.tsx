import React from 'react';
import styled from 'styled-components';

const BoldText = styled.span`
  font-weight: bold;
`;

const UnderlineText = styled.span`
  text-decoration: underline;
`;

const ColoredText = styled.span`
  color: blue;
`;

const Image = styled.img`
  width: 100px;
  height: auto;
`;

const GeminiModel = () => {
  return (
    <div>
      <BoldText>This text is bold.</BoldText>
      <UnderlineText>This text is underlined.</UnderlineText>
      <ColoredText>This text is blue.</ColoredText>
      <Image src="path/to/image.jpg" alt="Description" />
    </div>
  );
};

export default GeminiModel;
// components/mypage/SidebarSection.js
import React from 'react';
import styled from 'styled-components';

const Section = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const SidebarSection = ({ title, children }) => (
  <Section>
    <Title>{title}</Title>
    <div>{children}</div>
  </Section>
);

export default SidebarSection;
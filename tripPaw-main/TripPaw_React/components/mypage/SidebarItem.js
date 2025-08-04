// components/mypage/SidebarItem.js
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Item = styled.a.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  display: block;
  padding: 8px 0;
  color: ${({ active }) => (active ? '#c40d2e' : '#333')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  cursor: pointer;

  &:hover {
    color: #c40d2e;
  }
`;

const SidebarItem = ({ text, href, active }) => (
  <Link href={href} passHref>
    <Item active={active}>{text}</Item>
  </Link>
);

export default SidebarItem;

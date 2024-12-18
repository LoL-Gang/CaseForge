// src/screens/Layout.tsx
import React from 'react';
import styled from 'styled-components';
import { Link, Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 25%;
  background-color: #f4f4f4;
  padding: 20px;
`;

const MainContent = styled.div`
  width: 75%;
  padding: 20px;
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  text-decoration: none;
  color: #000;
  background-color: #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 16px;

  &:hover {
    background-color: #ccc;
  }
`;

const Layout: React.FC = () => {
  return (
    <LayoutContainer>
      <SidebarContainer>
        <ul style={{ listStyle: 'none', padding: 0 }}>

          <li>
            <StyledLink to="/">Go to Form Screen</StyledLink>
          </li>
          <li>
            <StyledLink to="/archive">Go to Archive</StyledLink>
          </li>
          <li>
            <StyledLink to="/case-study">Go to Case Study</StyledLink>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </SidebarContainer>
      <MainContent>
        <Outlet /> {/* Renders the matched child route */}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;

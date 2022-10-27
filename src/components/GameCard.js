import React from "react";
import styled from "styled-components";

const Card = styled.div`

//right: 15rem;
////top: 35rem;

  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
`;

const GameCard = (props) => {
  return <Card>{props.children}</Card>
};

export default GameCard;

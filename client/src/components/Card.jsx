import React from "react";
import Tilt from "react-parallax-tilt";
import styles from "../styles";

import { allCards } from "../assets";

const generateRandomCardImage = () =>
  allCards[Math.floor(Math.random() * (allCards.length - 1))];

const img1 = generateRandomCardImage();
const img2 = generateRandomCardImage();

const Card = ({ card, title, restStyles, cardRef, playerTwo }) => {
  return (
    <Tilt>
      <div ref={cardRef} className={`${styles.cardContainer} ${restStyles}`}>
        <img
          src={playerTwo ? img2 : img1}
          alt="ace_card"
          className={styles.cardImg}
        />

        <div
          className={`${styles.cardPointContainer} sm:left-[21.2%] left-[22%]  ${styles.flexCenter}`}
        >
          {/* card.att is actualy card is a prop which is destructured in the components parameter place and then we set the value of card in the battle.jsx as the player2 and player1. So player2 and player1 has the properties of att and def which is being used as card.att and 
          card.def */}
          <p className={`${styles.cardPoint} text-yellow-400`}>{card.att}</p>
        </div>
        <div
          className={`${styles.cardPointContainer} sm:right-[14.2%] right-[15%] ${styles.flexCenter}`}
        >
          <p className={`${styles.cardPoint} text-red-700`}>{card.def}</p>
        </div>

        <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
        {/* title value is actually set in battle.jsx like player2.name */}
          <p className={styles.cardText}>{title}</p>  
        </div>
      </div>
    </Tilt>
  );
};

export default Card;

import { ethers } from "ethers";
import { ABI } from "../contracts";
import { playAudio, sparcle } from "../utils/animation.js";
import { defenseSound } from "../assets";

const ADDNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (Logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(Logs);
    cb(parsedLog);
  });
};

const emptyAccount = "0x0000000000000000000000000000000000000000";

//* Get battle card coordinates
const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventListeners = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
}) => {

  const NewPlayerEventFilter = contract.filters.NewPlayer();
  ADDNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log("New Player created", args);

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
  });

  const NewGameTokenEventFilter = contract.filters.NewGameToken();
  ADDNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    console.log('New game token created!', args.owner);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player game token has been successfully generated',
      });

      navigate('/create-battle');
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();
  ADDNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("New Battle Started ", args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevupdateGameData) => prevupdateGameData + 1);
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();
  ADDNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle move initiated", args);
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();
  ADDNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log("Round ended!", args, walletAddress);

    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  // Battle Ended event listener
  const BattleEndedEventFilter = contract.filters.BattleEnded();
  ADDNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({ status: true, type: "success", message: "You won!" });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({ status: true, type: "failure", message: "You lost!" });
    }

    navigate("/create-battle");
  });
};

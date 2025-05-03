import React from "react";
import CreateCardService from "../services/create-card.service";
import DeleteCardService from "../services/delete-card.service";
import ListCardsService from "../services/list-cards.service";
import UpdateCardService from "../services/update-card.service";

export const CardContext = React.createContext({
    createCard: new CreateCardService(),
    deleteCard: new DeleteCardService(),
    listCards: new ListCardsService(),
    updateCard: new UpdateCardService()
});
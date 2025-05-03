import React from "react";
import CreateBankAccountService from "../services/create-bank-account.service";
import DeleteBankAccountService from "../services/delete-bank-account.service";
import ListBankAccountsService from "../services/list-bank-accounts.service";
import UpdateBankAccountService from "../services/update-bank-account.service";

export const BankAccountContext = React.createContext({
    createBankAccount: new CreateBankAccountService(),
    deleteBankAccount: new DeleteBankAccountService(),
    listBankAccounts: new ListBankAccountsService(),
    updateBankAccount: new UpdateBankAccountService()
});
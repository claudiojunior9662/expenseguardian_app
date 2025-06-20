/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Dialog, Divider, FormControl, FormControlLabel, FormLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, Stack, Switch, TextField, Tooltip } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModesModel, GridToolbarContainer } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import React from "react";
import { randomId } from '@mui/x-data-grid-generator';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MainBreadcumbs from "@/components/main-layout/main-breadcumb/main-breadcumb";
import { SpentContext } from "@/modules/spent/infrastructure/spent.context";
import { Spent } from "@/modules/spent/entities/spent.entity";
import SpentTypeEnum, { getSpentTypeValues } from "@/modules/spent/enums/spent-type.enum";
import { SpentDataRow } from "@/modules/spent/entities/spent-data-row.entity";
import { getFirstDayInMonth } from "@/shared/utils";
import { BudgetContext } from "@/modules/budget/infrastructure/budget.context";
import { Budget } from "@/modules/budget/entities/budget.entity";
import { BudgetCategoryContext } from "@/modules/budget/infrastructure/budget-category.context";
import { BudgetCategory } from "@/modules/budget/entities/budget-category.entity";
import { parse } from "date-fns";
import { CardContext } from "@/modules/card/infrastructure/card.context";
import { BankAccountContext } from "@/modules/bank/account/infraestructure/bank-account.context";
import { Card } from "@/modules/card/entities/card.entity";
import { BankAccount } from "@/modules/bank/account/entities/bank-account.entity";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

export default function MainSpents() {

    const { createSpent, deleteSpent, listSpentsByPeriod, updateSpent } = useContext(SpentContext);
    const { listBudgets } = useContext(BudgetContext);
    const { listBudgetCategories } = useContext(BudgetCategoryContext);
    const { listCards } = useContext(CardContext);
    const { listBankAccounts } = useContext(BankAccountContext);

    const [ budgets, setBudgets ] = useState<Budget[]>([]);
    const [ budgetCategories, setBudgetCategories ] = useState<BudgetCategory[]>([]);
    const [ cards, setCards ] = useState<Card[]>([]);
    const [ bankAccounts, setBankAccounts ] = useState<BankAccount[]>([]);
    const [  spentsRows, setSpentsRows ] = useState<SpentDataRow[]>([]);
    const [ rowModesModel, setRowModesModel ] = React.useState<GridRowModesModel>({});

    const Advice = withReactContent(Swal)

    const [ openSpentDialog, setOpenSpentDialog ] = useState<boolean>(false);

    const [ spentType, setSpentType] = useState<SpentTypeEnum>(SpentTypeEnum.CURRENT);
    const [ spentAlreadyPaid, setSpentAlreadyPaid] = useState(false);
    const [ spentDate, setSpentDate ] = useState<Dayjs|null|undefined>(dayjs());
    const [ spentDescription, setSpentDescription ] = useState<string>('');
    const [ spentBudgetCategory, setSpentBudgetCategory ] = useState<BudgetCategory>();
    const [ spentBudget, setSpentBudget ] = useState<Budget>();
    const [ spentCard, setSpentCard ] = useState<Card>();
    const [ spentBankAccount, setSpentBankAccount ] = useState<BankAccount>();
    const [ spentValue, setSpentValue ] = useState<number>(0);
    const [ spentInstallmentsNumber, setSpentInstallmentsNumber ] = useState<number>(0);
    const disabledSpents = [SpentTypeEnum.IN_INSTALLMENTS, SpentTypeEnum.SCHEDULED];
    const [ filterInitialDate, setFilterInitialDate ] = useState<Dayjs|null|undefined>(dayjs(getFirstDayInMonth()));
    const [ filterFinalDate, setFilterFinalDate ] = useState<Dayjs|null|undefined>(dayjs());
    const [ spentId, setSpentId ] = useState<number | undefined>(undefined);

    useEffect(() => {
        reload();
    }, [filterInitialDate, filterFinalDate]);

    function reload() {
        const decodedToken = jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!);

        listBudgets.execute(decodedToken.id, localStorage.getItem("apiAuthToken")!).then((response: { data: Budget[]; }) => {
            setBudgets(response.data);
        });

        listBudgetCategories.execute(decodedToken.id, localStorage.getItem("apiAuthToken")!).then((response: { data: BudgetCategory[]; }) => {
            setBudgetCategories(response.data);
        });

        listCards.execute(decodedToken.id, localStorage.getItem("apiAuthToken")!).then((response: { data: Card[]; }) => {
            setCards(response.data);
        });

        listBankAccounts.execute(decodedToken.id, localStorage.getItem("apiAuthToken")!).then((response: { data: BankAccount[]; }) => {
            setBankAccounts(response.data);
        });

        listSpentsByPeriod
            .execute(
                decodedToken.id,
                filterInitialDate ? filterInitialDate.toDate() : new Date(),
                filterFinalDate ? filterFinalDate.toDate() : new Date(),
                localStorage.getItem("apiAuthToken")!
            )
            .then((response: { data: any[]; }) => {
                setSpentsRows(response.data.map((spent: any) => {
                    return {
                        id: randomId(),
                        dataId: spent.id,
                        type: spent.type,
                        value: spent.value,
                        alreadyPaid: spent.alreadyPaid,
                        date: parse(spent.date, 'yyyy-MM-dd', new Date()),
                        description: spent.description,
                        budgetId: spent.budgetId,
                        categoryId: spent.categoryId,
                        cardId: spent.cardId,
                        bankAccountId: spent.bankAccountId,
                        isNew: false
                    }
                }));
            });
    }

    function cleanForm() {
        setSpentType(SpentTypeEnum.CURRENT);
        setSpentAlreadyPaid(false);
        setSpentDate(dayjs());
        setSpentDescription('');
        setSpentBudgetCategory(undefined);
        setSpentBudget(undefined);
        setSpentCard(undefined);
        setSpentBankAccount(undefined);
        setSpentValue(0);
        setSpentInstallmentsNumber(0);
        setSpentId(undefined);
    }

    function EditToolbar() {
        const handleClick = () => {
            setOpenSpentDialog(true);
        };
      
        return (
          <GridToolbarContainer>
            <Box className="flex justify-between items-center w-full mt-2">
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                    Add spent
                </Button>
                <Box className="justify-end flex items-center gap-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label='Initial date'
                            value={filterInitialDate}
                            onChange={setFilterInitialDate}   
                            format="DD/MM/YYYY"
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label='Final date'
                            value={filterFinalDate}
                            onChange={setFilterFinalDate}      
                            format="DD/MM/YYYY"
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
          </GridToolbarContainer>
        );
    }

    function getBudgetsValues(): number[] {
        return budgets.map((budget) => (budget.id!));
    }

    function getCategoriesValues(): number[] {
        return budgetCategories.map((category) => (category.id!));
    }

    function getCardsValues(): number[] {
        return cards.map((card) => (card.id!));
    }

    function getBankAccountsValues(): number[] {
        return bankAccounts.map((bankAccount) => (bankAccount.id!));
    }

    const columns: GridColDef<(typeof spentsRows)[number]>[] = [
        {
            field: 'type',
            headerName: 'Type',
            width: 150,
            editable: false,
            hideable: false
        },
        {
            field: 'value',
            headerName: 'Value',
            width: 150,
            editable: false,
            hideable: false
        },
        {
            field: 'alreadyPaid',
            headerName: 'Already paid',
            width: 150,
            type: 'boolean',
            editable: false,
            hideable: false
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 150,
            type: 'date',
            editable: false,
            hideable: false
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 150,
            type: 'string',
            editable: false,
            hideable: false
        },
        {
            field: 'categoryId',
            headerName: 'Category',
            width: 150,
            type: 'singleSelect',
            editable: false,
            valueOptions: getCategoriesValues(),
            getOptionLabel(value) {
                const category = budgetCategories.find((category) => category.id === value);
                return category ? `${category.description}` : '';
            },
            hideable: false
        },
        {
            field: 'budgetId',
            headerName: 'Budget',
            width: 150,
            type: 'singleSelect',
            editable: false,
            valueOptions: getBudgetsValues(),
            getOptionLabel(value) {
                const budget = budgets.find((budget) => budget.id === value);
                return budget ? `${budget.year}-${budget.month}` : '';
            },
            hideable: false,
        },
        {
            field: 'cardId',
            headerName: 'Card',
            width: 150,
            type: 'singleSelect',
            editable: false,
            valueOptions: getCardsValues(),
            getOptionLabel(value) {
                const card = cards.find((card) => card.id === value);
                return card ? `${card.number}` : '';
            },
            hideable: false,
        },
        {
            field: 'bankAccountId',
            headerName: 'Account',
            width: 150,
            type: 'singleSelect',
            editable: false,
            valueOptions: getBankAccountsValues(),
            getOptionLabel(value) {
                const bankAccount = bankAccounts.find((bankAccount) => bankAccount.id === value);
                return bankAccount ? `${bankAccount.name}` : '';
            },
            hideable: false,
        },
        {field: 'actions', headerName: 'Actions', width: 150, hideable: false, renderCell: (params) => {

            return [
                <Tooltip title='Edit' key={1}>
                    <GridActionsCellItem
                        icon={<CreateIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params.row.id!)}
                        color="inherit"
                    />
                </Tooltip>,
                <Tooltip title={params.row.alreadyPaid ? 'Mark as unpaid' : 'Mark as paid'} key={1}>
                    <GridActionsCellItem
                        icon={params.row.alreadyPaid ? <ThumbDownAltIcon /> : <ThumbUpAltIcon />}
                        label={params.row.alreadyPaid ? 'Mark as unpaid' : 'Mark as paid'}
                        className="textPrimary"
                        onClick={params.row.alreadyPaid ? handlePaidClick(params.row.id!, false) : handlePaidClick(params.row.id!, true)}
                        color="inherit"
                    />
                </Tooltip>,
                <Tooltip title='Delete' key={2}>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(params.row.id!)}
                        color="inherit"
                    />
                </Tooltip>
            ];
        }}
    ];

    const handleEditClick = (id: GridRowId) => () => {
        const row = spentsRows.find((row) => row.id === id);

        if (!row) return;

        setSpentId(row.dataId);
        setSpentType(SpentTypeEnum[(row.type as unknown) as keyof typeof SpentTypeEnum]);
        setSpentAlreadyPaid(row.alreadyPaid);
        setSpentDate(dayjs(row.date));
        setSpentDescription(row.description);
        setSpentBudgetCategory(budgetCategories.find(category => category.id === row.categoryId));
        setSpentBudget(budgets.find(budget => budget.id === row.budgetId));
        setSpentCard(cards.find(card => card.id === row.cardId));
        setSpentBankAccount(bankAccounts.find(bankAccount => bankAccount.id === row.bankAccountId));
        setSpentValue(row.value);
        setSpentInstallmentsNumber(0);

        setOpenSpentDialog(true);
    };

    const handlePaidClick = (id: GridRowId, alreadyPaid: boolean) => () => {
        const row = spentsRows.find((row) => row.id === id);

        if (!row) return;

        const spent: Spent = {
            id: row.dataId,
            type: row.type,
            value: row.value,
            alreadyPaid: alreadyPaid,
            date: row.date ? row.date : new Date(),
            description: row.description,
            budgetId: row.budgetId!,
            categoryId: row.categoryId!,
            cardId: row.cardId ? row.cardId : undefined,
            bankAccountId: row.bankAccountId ? row.bankAccountId : undefined
        }

        updateSpent.execute(spent, localStorage.getItem("apiAuthToken")!).then(() => {
            Advice.fire({
                title: 'Spent paid status changed successfully!',
                text: 'The spent paid status has been updated successfully.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            reload();
        }).catch(() => {
            Advice.fire({
                title: 'Error while updating!',
                text: 'Try again or contact support',
                icon: 'error',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        });
    };
    
    function handleSaveClick(closeDialog: boolean) {
        if (!spentDate || !spentDescription || !spentBudgetCategory || !spentBudget) {
            Advice.fire({
                title: 'Error',
                text: 'Please fill all required fields',
                icon: 'error',
                toast: true,
                position: 'top-end',
                target: document.getElementById('spent-dialog')!,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            return;
        }

        const spent: Spent = {
            id: spentId,
            type: spentType,
            value: spentValue,
            alreadyPaid: spentAlreadyPaid,
            date: spentDate ? spentDate.toDate() : new Date(),
            description: spentDescription,
            budgetId: spentBudget!.id!,
            categoryId: spentBudgetCategory!.id!,
            cardId: spentCard ? spentCard.id : undefined,
            bankAccountId: spentBankAccount ? spentBankAccount.id : undefined
        }

        if(!spentId) {
            createSpent.execute(spent, localStorage.getItem("apiAuthToken")!).then(() => {
                Advice.fire({
                    title: 'Spent saved successfully!',
                    text: 'The spent has been created successfully.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    target: !closeDialog ? document.getElementById('spent-dialog')! : 'body',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                reload();
                cleanForm();
            }).catch(() => {
                Advice.fire({
                    title: 'Error while creating!',
                    text: 'Try again or contact support',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    target: !closeDialog ? document.getElementById('spent-dialog')! : 'body',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            });
        } else {
            updateSpent.execute(spent, localStorage.getItem("apiAuthToken")!).then(() => {
                Advice.fire({
                    title: 'Spent updated successfully!',
                    text: 'The spent has been updated successfully.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    target: !closeDialog ? document.getElementById('spent-dialog')! : 'body',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                reload();
                cleanForm();
            }).catch(() => {
                Advice.fire({
                    title: 'Error while updating!',
                    text: 'Try again or contact support',
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    target: !closeDialog ? document.getElementById('spent-dialog')! : 'body',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            });
        }

        if (closeDialog) {
            setOpenSpentDialog(false);
        }
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        Advice.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const row = spentsRows.find((row) => row.id === id);

                deleteSpent.execute(row!.dataId!, localStorage.getItem("apiAuthToken")!).then(() => {
                    setSpentsRows(spentsRows.filter((row) => row.id !== id));
                }).catch(() => {
                    Advice.fire({
                        title: 'Error while deleting!',
                        text: 'Try again or contact support',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                });
            }
        });
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
    };

    const handleCloseSpentDialog = () => {
        setOpenSpentDialog(false);
    }

    const handleChangeSpentType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpentType(event.target.value as unknown as SpentTypeEnum);
    };

    const handleChangeSpentAlreadyPaid = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpentAlreadyPaid((event.target as HTMLInputElement).checked);
    };

    return (
        <Box sx={{ width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
            <MainBreadcumbs openedLink="Spents" />
            <DataGrid
                rows={spentsRows}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 5,
                    },
                },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                slots={{ toolbar: EditToolbar }}
            />
            <Dialog
                fullWidth
                maxWidth='lg'
                open={openSpentDialog}
                onClose={handleCloseSpentDialog}
                id="spent-dialog"
            >
                <Box className='mt-2 ms-2 mb-2'>
                    <FormControl>
                        <FormLabel id="spent-type-form-label">Type</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="spent-type-radio-buttons-group-label"
                            name="spent-type-radio-buttons-group"
                            value={spentType ?? ''}
                            onChange={handleChangeSpentType}
                        >
                            {getSpentTypeValues().map(value => (
                                <Tooltip key={value.type} title={value.helper} placement="top"  slotProps={{transition: { timeout: 600 }}}>
                                    <FormControlLabel key={value.type} value={value.type} control={<Radio />} label={value.helperType} disabled={disabledSpents.includes(value.type)} />
                                </Tooltip>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Divider />
                    <Box className='mt-3 ms-3 me-3 grid grid-cols-3 gap-4'>
                        <FormControl>
                            <InputLabel htmlFor="outlined-adornment-spent-value">Value</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-spent-value"
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Value"
                                type="number"
                                value={spentValue}
                                onChange={(event) => setSpentValue(Number(event.target.value))}
                            />
                        </FormControl>
                        <FormControlLabel className="flex justify-center" control={<Switch value={spentAlreadyPaid} onChange={handleChangeSpentAlreadyPaid} />} label="Already paid" />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                                label='Date'
                                value={spentDate}
                                onChange={setSpentDate}
                                format="DD/MM/YYYY"   
                            />
                        </LocalizationProvider>
                        
                    </Box>
                    <Box className='mt-3 ms-3 me-3'>
                        <TextField
                            required
                            id="spent-description-text-field"
                            label="Description"
                            value={spentDescription}
                            onChange={(event) => setSpentDescription(event.target.value)}
                            fullWidth
                        />
                    </Box>
                    <Box className='mt-3 ms-3 me-3 grid grid-cols-2 gap-4'>
                        <FormControl fullWidth>
                            <InputLabel id="spent-budget-category-select-label">Category</InputLabel>
                            <Select
                                labelId="spent-budget-category-select-label"
                                id="spent-budget-category-select"
                                value={spentBudgetCategory?.id ?? ''}
                                label="Category"
                                onChange={event => {
                                    const selectedCategory = budgetCategories.find(category => category.id === Number(event.target.value));
                                    setSpentBudgetCategory(selectedCategory);
                                }}
                            >
                                {budgetCategories.map(category => (
                                    <MenuItem key={category.id} value={category.id}>{category.description}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="spent-budget-select-label">Budget</InputLabel>
                            <Select
                                labelId="spent-budget-select-label"
                                id="spent-budget-select"
                                value={spentBudget?.id ?? ''}
                                label="Budget"
                                onChange={(event) => {
                                    const selectedBudget = budgets.find(budget => budget.id === Number(event.target.value));
                                    setSpentBudget(selectedBudget);
                                }}
                            >
                                {budgets.map(budget => (
                                    <MenuItem key={budget.id} value={budget.id}>{budget.year}-{budget.month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className='mt-3 ms-3 me-3 grid grid-cols-2 gap-4'>
                        <FormControl fullWidth>
                            <InputLabel id="spent-card-select-label">Card</InputLabel>
                            <Select
                                labelId="spent-card-select-label"
                                id="spent-card-select"
                                value={spentCard?.id ?? ''}
                                label="Card"
                                onChange={(event) => {
                                    const selectedCard = cards.find(card => card.id === Number(event.target.value));
                                    setSpentCard(selectedCard);
                                }}
                            >
                                {cards.map(card => (
                                    <MenuItem key={card.id} value={card.id}>{card.number}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="spent-bank-account-select-label">Account</InputLabel>
                            <Select
                                labelId="spent-bank-account-select-label"
                                id="spent-bank-account-select"
                                value={spentBankAccount?.id ?? ''}
                                label="Account"
                                onChange={(event) => {
                                    const selectedBankAccount = bankAccounts.find(bankAccount => bankAccount.id === Number(event.target.value));
                                    setSpentBankAccount(selectedBankAccount);
                                }}
                            >
                                {bankAccounts.map(bankAccount => (
                                    <MenuItem key={bankAccount.id} value={bankAccount.id}>{bankAccount.number}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {spentType === SpentTypeEnum.IN_INSTALLMENTS && (
                        <Box className='mt-3 ms-3 me-3 grid grid-cols-2 gap-4'>
                            <FormControl fullWidth>
                                <TextField
                                    id="spent-installments-text-field"
                                    label="Number of installments"
                                    type="number"
                                    slotProps={{
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    }}
                                />
                            </FormControl>
                        </Box>
                    )}
                </Box>
                <Divider/>
                <Stack spacing={1} direction="row" className="mt-2 mb-2 me-2 justify-end">
                    <Button variant="contained" color="error" onClick={() => {
                        setOpenSpentDialog(false);
                        cleanForm();
                    }}>Cancel</Button>
                    {!spentId && 
                        <Button variant="contained" onClick={() => {
                            handleSaveClick(false);
                        }}>Save and next</Button>
                    }
                    <Button variant="contained" color="success" onClick={() => {
                        handleSaveClick(true);
                    }}>{spentId ? 'Update' : 'Save and close'}</Button>
                </Stack>
            </Dialog>
        </Box>
    )
}
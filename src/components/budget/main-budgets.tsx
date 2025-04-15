/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Dialog, FormControl, Paper, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridToolbarContainer } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import React from "react";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { randomId } from '@mui/x-data-grid-generator';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MainBreadcumbs from "@/components/main-layout/main-breadcumb/main-breadcumb";
import { BudgetContext } from "@/modules/budget/infrastructure/budget.context";
import { BudgetDataRow } from "@/modules/budget/entities/budget-data-row.entity";
import { Budget } from "@/modules/budget/entities/budget.entity";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { NumericFormat } from 'react-number-format';
import { Dayjs } from "dayjs";
import { BudgetCategoryContext } from "@/modules/budget/infrastructure/budget-category.context";
import { BudgetCategory } from "@/modules/budget/entities/budget-category.entity";
import { BudgetCategoryPercentageDataRow } from "@/modules/budget/entities/budget-category-percentage-data-row.entity";
import BalanceIcon from '@mui/icons-material/Balance';
import { BudgetCategoryPercentage } from "@/modules/budget/entities/budget-category-percentage.entity";
import { BudgetCategoryPercentageContext } from "@/modules/budget/infrastructure/budget-category-percentage.context";

export default function MainBudgets() {

    const { createBudget, deleteBudget, listBudgets, updateBudget } = useContext(BudgetContext);
    const { createBudgetCategoryPercentage } = useContext(BudgetCategoryPercentageContext);
    const { listBudgetCategories } = useContext(BudgetCategoryContext);
    const [  budgetsRows, setBudgetsRows ] = useState<BudgetDataRow[]>([]);
    const [ rowModesModel, setRowModesModel ] = React.useState<GridRowModesModel>({});
    const Advice = withReactContent(Swal)

    const [ openBudgetDialog, setOpenBudgetDialog ] = useState<boolean>(false);
    const [ activeBudgetStep, setActiveBudgetStep ] = React.useState(0);
    const budgetDialogSteps = ['Basic details', 'Category percentages', 'Review'];

    const [ budgetDate, setBudgetDate ] = useState<Dayjs|null|undefined>(undefined);
    const [ budgetSalary, setBudgetSalary ] = React.useState('0');

    const [ budgetCategories, setBudgetCategories ] = useState<BudgetCategory[]>([]);
    const [ budgetCategoriesSelectedRows, setBudgetCategoriesSelectedRows ] = useState<BudgetCategoryPercentageDataRow[]>([]);
    const [ rowCategoriesModesModel, setRowCategoriesModesModel ] = React.useState<GridRowModesModel>({});

    useEffect(() => {
        const decodedToken = jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!);

        listBudgets
            .execute(decodedToken.id, localStorage.getItem("apiAuthToken")!)
            .then((response) => {
                setBudgetsRows(response.data.map((budget) => {
                    return {
                        id: randomId(),
                        dataId: budget.id,
                        month: budget.month,
                        year: budget.year,
                        salary: budget.salary,
                        userId: budget.userId,
                        isNew: false
                    }
                }));
            });
    }, []);

    function EditToolbar() {
        const handleClick = () => {
            setOpenBudgetDialog(true);
        };
      
        return (
          <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
              Add budget
            </Button>
          </GridToolbarContainer>
        );
    }

    function EditToolbarCategories() {
        const isInEditMode = budgetCategoriesSelectedRows.some((row) => row.isNew);

        const handleClick = () => {
          const id = randomId();

          setBudgetCategoriesSelectedRows((oldRows) => [
            ...oldRows,
            { id, dataId: undefined, percentage: 0, budgetId: 0, categoryId: 0, categoryDescription: '', isNew: true },
          ]);

          setRowCategoriesModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
          }));
        };

        const handleAutoBalance = () => {
            const totalCategories = budgetCategoriesSelectedRows.length;
            const percentage = 100 / totalCategories;

            setBudgetCategoriesSelectedRows(budgetCategoriesSelectedRows.map((row) => {
                return {
                    ...row,
                    percentage: percentage
                }
            }));
        }
      
        return (
          <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
              Add category percentage
            </Button>
            <Button color="primary" startIcon={<BalanceIcon />} onClick={handleAutoBalance} disabled={isInEditMode}>
              Auto balance
            </Button>
          </GridToolbarContainer>
        );
    }

    const columns: GridColDef<(typeof budgetsRows)[number]>[] = [
        {
            field: 'month',
            headerName: 'Month',
            width: 150,
            editable: false,
            hideable: false,
        },
        {
            field: 'year',
            headerName: 'Year',
            width: 150,
            editable: false,
            hideable: false,
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 150,
            editable: true,
            hideable: false,
        },
        {
            field: 'actions', headerName: 'Actions', width: 150, hideable: false, renderCell: (params) => {
            const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        key={1}
                        icon={<SaveIcon />}
                        label="Save"
                        sx={{
                            color: 'primary.main',
                        }}
                        onClick={handleSaveClick(params.row.id)}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(params.row.id)}
                        color="inherit"
                    />,
                  ];
            }

            return [
                <Tooltip title='Edit' key={1}>
                    <GridActionsCellItem
                        icon={<CreateIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(params.row.id)}
                        color="inherit"
                    />
                </Tooltip>,
                <Tooltip title='Delete' key={2}>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(params.row.id)}
                        color="inherit"
                    />
                </Tooltip>
            ];
        }}
    ];

    const categoryColumns: GridColDef<(typeof budgetCategoriesSelectedRows)[number]>[] = [
        {
            field: 'categoryDescription',
            headerName: 'Description',
            width: 150,
            editable: true,
            hideable: false,
            type: 'singleSelect',
            valueOptions: budgetCategories.map((category) => category.description)
        },
        {
            field: 'percentage',
            headerName: 'Percentage',
            width: 150,
            editable: true,
            hideable: false,
        },
        {
            field: 'actions', headerName: 'Actions', width: 150, hideable: false, renderCell: (params) => {
            const isInEditMode = rowCategoriesModesModel[params.row.id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        key={1}
                        icon={<SaveIcon />}
                        label="Save"
                        sx={{
                            color: 'primary.main',
                        }}
                        onClick={handleCategoriesSaveClick(params.row.id)}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCategoriesCancelClick(params.row.id)}
                        color="inherit"
                    />,
                  ];
            }

            return [
                <Tooltip title='Edit' key={1}>
                    <GridActionsCellItem
                        icon={<CreateIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleCategoriesEditClick(params.row.id)}
                        color="inherit"
                    />
                </Tooltip>,
                <Tooltip title='Delete' key={2}>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleCategoriesDeleteClick(params.row.id)}
                        color="inherit"
                    />
                </Tooltip>
            ];
        }}
    ];

    const handleNext = () => {
        function hasDuplicateCategoryDescriptions(): string[] {
            const seen = new Set<string>();
            const duplicates: string[] = [];
            
            for (const item of budgetCategoriesSelectedRows) {
              if (item.categoryDescription) {
                if (seen.has(item.categoryDescription)) {
                    duplicates.push(item.categoryDescription);
                }
                seen.add(item.categoryDescription);
              }
            }
          
            return duplicates;
          }

        const newActiveBudgetStep = activeBudgetStep + 1;

        if (newActiveBudgetStep === 1 && budgetCategories.length === 0) {
            const decodedToken = jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!);

            listBudgetCategories
                .execute(decodedToken.id, localStorage.getItem("apiAuthToken")!)
                .then((response) => {
                    setBudgetCategories(response.data);
                });
        }

        if(newActiveBudgetStep === 2) {
            if(budgetCategoriesSelectedRows.length === 0) {
                Advice.fire({
                    title: 'Error while saving!',
                    text: 'You must add at least one category percentage',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    target: document.getElementById('budget-dialog')
                  });
                return;
            }

            if(budgetCategoriesSelectedRows.reduce((acc, row) => acc + row.percentage, 0) !== 100) {
                Advice.fire({
                    title: 'Error while saving!',
                    text: 'The sum of all categories percentages must be 100',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    target: document.getElementById('budget-dialog')
                  });
                return;
            }

            const duplicates = hasDuplicateCategoryDescriptions();
            if (duplicates.length > 0) {
                Advice.fire({
                    title: 'Error while saving!',
                    text: 'Category descriptions must be unique. Duplicates: ' + duplicates.join(', '),
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    target: document.getElementById('budget-dialog')
                  });
                return;
            }
        }
    
        setActiveBudgetStep(newActiveBudgetStep);
    };

    const handleFinish = async () => {
        const budget: Budget = {
            month: budgetDate!.month() + 1,
            year: budgetDate!.year(),
            salary: Number(budgetSalary.replace('$', '').replace(',', '')),
            userId: jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!).id
        }

        let budgetResponse;
        try {
            budgetResponse = await createBudget.execute(budget, localStorage.getItem("apiAuthToken")!);    
        } catch {
            Advice.fire({
                title: 'Error while creating budget!',
                text: 'Try again or contact support',
                icon: 'error',
                confirmButtonText: 'Ok'
              });
            return;
        }
        
        const createdBudget: Budget = budgetResponse.data as Budget;

        try {
            budgetCategoriesSelectedRows.forEach(async (row) => {
                const budgetCategoryPercentage: BudgetCategoryPercentage = {
                    budgetId: createdBudget.id!,
                    categoryId: budgetCategories.find((category) => category.description === row.categoryDescription)!.id!,
                    percentage: row.percentage
                }
    
                await createBudgetCategoryPercentage.execute(budgetCategoryPercentage, localStorage.getItem("apiAuthToken")!);
            });
        } catch {
            Advice.fire({
                title: 'Error while creating budget categories!',
                text: 'Try again or contact support',
                icon: 'error',
                confirmButtonText: 'Ok'
              });

            await deleteBudget.execute(createdBudget.id!, localStorage.getItem("apiAuthToken")!);

            return;
        }

        Advice.fire({
            title: 'Budget created successfully!',
            text: 'You can now see your new budget in the list',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        setBudgetsRows([
            ...budgetsRows,
            {
                id: randomId(),
                dataId: createdBudget.id,
                month: budgetDate!.month() + 1,
                year: budgetDate!.year(),
                salary: Number(budgetSalary.replace('$', '').replace(',', '')),
                userId: createdBudget.userId,
                isNew: false
            }
        ]);

        setBudgetCategoriesSelectedRows([]);
        setOpenBudgetDialog(false);
        setActiveBudgetStep(0);
        setBudgetDate(undefined);
        setBudgetSalary('0');
        setRowCategoriesModesModel({});
        setRowModesModel({});
        setBudgetCategories([]);
    };
    
    const handleBack = () => {
        setActiveBudgetStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleCategoriesEditClick = (id: GridRowId) => () => {
        setRowCategoriesModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCategoriesSaveClick = (id: GridRowId) => () => {
        setRowCategoriesModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        Advice.fire({
            title: 'Are you sure?',
            text: 'Your budgets percentages and spents related to this budget will be also deleted and you will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const row = budgetsRows.find((row) => row.id === id);

                deleteBudget.execute(row!.dataId!, localStorage.getItem("apiAuthToken")!).then(() => {
                    setBudgetsRows(budgetsRows.filter((row) => row.id !== id));
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

    const handleCategoriesDeleteClick = (id: GridRowId) => () => {
        setBudgetCategoriesSelectedRows(budgetCategoriesSelectedRows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = budgetsRows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setBudgetsRows(budgetsRows.filter((row) => row.id !== id));
        }
    };

    const handleCategoriesCancelClick = (id: GridRowId) => () => {
        setRowCategoriesModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = budgetCategoriesSelectedRows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setBudgetCategoriesSelectedRows(budgetCategoriesSelectedRows.filter((row) => row.id !== id));
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowModesCategoriesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowCategoriesModesModel(newRowModesModel);
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
    };

    const handleRowCategoriesEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const row = budgetsRows.find((row) => row.id === newRow.id);

        const decodedToken = jwtDecode(localStorage.getItem("apiAuthToken")!);

        if (row!.isNew) {
            const budget: Budget = {
                month: newRow.month,
                year: newRow.year,
                salary: newRow.salary,
                userId: decodedToken.id
            };

            createBudget.execute(budget, localStorage.getItem("apiAuthToken")!).then(() => {
                return updatedRow;
            }).catch(() => {
                Advice.fire({
                    title: 'Error while creating!',
                    text: 'Try again or contact support',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                return null;
            });
        } else {
            const budget: Budget = {
                id: newRow.dataId,
                month: newRow.month,
                year: newRow.year,
                salary: newRow.salary,
                userId: decodedToken.id
            };

            updateBudget.execute(budget, localStorage.getItem("apiAuthToken")!).then(() => {
                return updatedRow;
            }).catch(() => {
                Advice.fire({
                    title: 'Error while updating!',
                    text: 'Try again or contact support',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                return null;
            });
        }

        const updatedRow = newRow;
        updatedRow.isNew = false;
        setBudgetsRows(budgetsRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const processRowCategoriesUpdate = (newRow: GridRowModel) => {
        const updatedRow = newRow;
        updatedRow.isNew = false;
        setBudgetCategoriesSelectedRows(budgetCategoriesSelectedRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleChangeSalary = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBudgetSalary(
            event.target.value);
    };

    const basicDetailsBudget = () => {
        return (
            <FormControl fullWidth sx={{ m: 1 }}>
                <Box className='grid grid-cols-2 gap-4 mt-6'>
                    <NumericFormat
                        value={budgetSalary}
                        onChange={handleChangeSalary}
                        customInput={TextField}
                        thousandSeparator
                        valueIsNumericString
                        prefix="$"
                        variant="standard"
                        label="Salary"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker 
                            label='Month and year' 
                            views={['month', 'year']}
                            value={budgetDate}
                            onChange={setBudgetDate}
                        />
                    </LocalizationProvider>
                    
                </Box>
            </FormControl>
          );
    }

    const categoryPercentagesBudget = () => {
        return (
            <DataGrid
                className="mt-4"
                rows={budgetCategoriesSelectedRows}
                columns={categoryColumns}
                disableRowSelectionOnClick
                disableColumnFilter
                hideFooterPagination
                editMode="row"
                rowModesModel={rowCategoriesModesModel}
                onRowModesModelChange={handleRowModesCategoriesModelChange}
                onRowEditStop={handleRowCategoriesEditStop}
                processRowUpdate={processRowCategoriesUpdate}
                slots={{ toolbar: EditToolbarCategories }}
            />
          );
    }

    const reviewDetailsBudget = () => {
        return (
            <Box>
                <Typography variant='h6' className="mt-6">Basic details</Typography>
                <Box className='grid grid-cols-2 gap-4 mt-2'>
                    <Typography variant='body1'>Month and year: {budgetDate?.format('MMMM YYYY')}</Typography>
                    <Typography variant='body1'>Salary: {budgetSalary}</Typography>
                </Box>
                <Typography variant='h6' className="mt-6">Category percentages</Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Percentage</TableCell>
                            <TableCell align="right">Corresponding value</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {budgetCategoriesSelectedRows.map((row) => (
                                <TableRow
                                    key={row.categoryDescription}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.categoryDescription}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        {`${row.percentage} %`}
                                    </TableCell>
                                    <TableCell align="right">{`$ ${((Number(budgetSalary.replace('$', '').replace(',', '')) * row.percentage)/100).toFixed(2)}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </Box>
        );
    }

    const handleCloseBudgetDialog = () => {
        setBudgetCategoriesSelectedRows([]);
        setOpenBudgetDialog(false);
    }

    return (
        <Box sx={{ width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
            <MainBreadcumbs openedLink="Budgets" />
            <DataGrid
                rows={budgetsRows}
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
                processRowUpdate={processRowUpdate}
                slots={{ toolbar: EditToolbar }}
            />
            <Dialog
                fullWidth
                maxWidth='lg'
                open={openBudgetDialog}
                onClose={handleCloseBudgetDialog}
                id='budget-dialog'
            >
                <Box sx={{ width: '100%' }} className="p-4">
                    <Stepper activeStep={activeBudgetStep}>
                        {budgetDialogSteps.map((label) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeBudgetStep === 2 ? (
                        <React.Fragment>
                            {reviewDetailsBudget()}
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}>
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleFinish} disabled={budgetCategoriesSelectedRows.some((row) => row.isNew)}>
                                    Finish
                                </Button>
                            </Box>
                        </React.Fragment>
                        ) : (
                        <React.Fragment>
                            {activeBudgetStep === 0 &&
                                basicDetailsBudget()
                            }
                            {activeBudgetStep === 1 &&
                                categoryPercentagesBudget()
                            }
                            {activeBudgetStep === 2 &&
                                reviewDetailsBudget()
                            }
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeBudgetStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}>
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleNext} disabled={budgetCategoriesSelectedRows.some((row) => row.isNew)}>
                                    Next
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                    </Box>
            </Dialog>
        </Box>
        
    )
}
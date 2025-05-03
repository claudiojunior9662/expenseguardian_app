/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Tooltip } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem, GridColDef, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridSlotProps, GridToolbarContainer } from '@mui/x-data-grid';
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
import { BankAccountContext } from "@/modules/bank/account/infraestructure/bank-account.context";
import { BankAccountDataRow } from "@/modules/bank/account/entities/bank-account-data-row.entity";
import { BankAccount } from "@/modules/bank/account/entities/bank-account.entity";
import BankAccountTypeEnum, { getBankAccountTypeValues } from "@/modules/bank/account/enums/bank-account-type.enum";

function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setBankAccountsRows, setRowModesModel } = props;
  
    const handleClick = () => {
      const id = randomId();
      setBankAccountsRows((oldRows: any) => [
        ...oldRows,
        { id, name: '', type: '', number: '', balance: '', isNew: true },
      ]);
      setRowModesModel((oldModel: any) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add bank account
        </Button>
      </GridToolbarContainer>
    );
}

export default function MainBankAccounts() {

    const { createBankAccount, deleteBankAccount, listBankAccounts, updateBankAccount } = useContext(BankAccountContext);
    const [  bankAccountsRows, setBankAccountsRows ] = useState<BankAccountDataRow[]>([]);
    const [ rowModesModel, setRowModesModel ] = React.useState<GridRowModesModel>({});
    const Advice = withReactContent(Swal)

    useEffect(() => {
        const decodedToken = jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!);

        listBankAccounts
            .execute(decodedToken.id, localStorage.getItem("apiAuthToken")!)
            .then((response) => {
                setBankAccountsRows(response.data.map((bankAccount) => {
                    return {
                        id: randomId(),
                        dataId: bankAccount.id,
                        type: bankAccount.type,
                        name: bankAccount.name,
                        number: bankAccount.number,
                        balance: bankAccount.balance,
                        userId: bankAccount.userId,
                        isNew: false
                    }
                }));
            });
    }, []);

    const columns: GridColDef<(typeof bankAccountsRows)[number]>[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: true,
            hideable: false,
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: getBankAccountTypeValues(),
            hideable: false,
        },
        {
            field: 'number',
            headerName: 'Number',
            width: 150,
            editable: true,
            hideable: false,
        },
        {
            field: 'balance',
            headerName: 'Balance',
            width: 150,
            type: 'number',
            editable: true,
            hideable: false,
        },
        {field: 'actions', headerName: 'Actions', width: 150, hideable: false, renderCell: (params) => {
            const isInEditMode = rowModesModel[params.row.id!]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                        key={1}
                        icon={<SaveIcon />}
                        label="Save"
                        sx={{
                            color: 'primary.main',
                        }}
                        onClick={handleSaveClick(params.row.id!)}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(params.row.id!)}
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
                        onClick={handleEditClick(params.row.id!)}
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
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        Advice.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const row = bankAccountsRows.find((row) => row.id === id);

                deleteBankAccount.execute(row!.dataId!, localStorage.getItem("apiAuthToken")!).then(() => {
                    setBankAccountsRows(bankAccountsRows.filter((row) => row.id !== id));
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

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = bankAccountsRows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setBankAccountsRows(bankAccountsRows.filter((row) => row.id !== id));
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        const row = bankAccountsRows.find((row) => row.id === newRow.id);

        const decodedToken = jwtDecode(localStorage.getItem("apiAuthToken")!);
        const updatedRow = { ...newRow, isNew: false };

        try {
            if (row!.isNew) {
                const bankAccount: BankAccount = {
                    type: newRow.type,
                    name: newRow.name,
                    number: newRow.number,
                    balance: newRow.balance,
                    userId: decodedToken.id
                };
                await createBankAccount.execute(bankAccount, localStorage.getItem("apiAuthToken")!);
            } else {
                const bankAccount: BankAccount = {
                    id: newRow.dataId,
                    type: newRow.type,
                    name: newRow.name,
                    number: newRow.number,
                    balance: newRow.balance,
                    userId: decodedToken.id
                };
                await updateBankAccount.execute(bankAccount, localStorage.getItem("apiAuthToken")!);
            }
            setBankAccountsRows(bankAccountsRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
        } catch (error) {
            Advice.fire({
                title: row!.isNew ? 'Error while creating!' : 'Error while updating!',
                text: 'Try again or contact support',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return row; // Return the original row in case of failure
        }
    };

    return (
        <Box sx={{ width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
            <MainBreadcumbs openedLink="Bank accounts" />
            <DataGrid
                rows={bankAccountsRows}
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
                slotProps={{
                    toolbar: { setBankAccountsRows, setRowModesModel },
                  }}
            />
            </Box>
    )
}
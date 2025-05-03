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
import { CardDataRow } from "@/modules/card/entities/card-data-row.entity";
import { CardContext } from "@/modules/card/infrastructure/card.context";
import { getCardTypeValues } from "@/modules/card/enums/card-type.enum";
import { Card } from "@/modules/card/entities/card.entity";

function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setCardsRows, setRowModesModel } = props;
  
    const handleClick = () => {
      const id = randomId();
      setCardsRows((oldRows: any) => [
        ...oldRows,
        { id, cardType: '', number: '', dueDay: '', expirationMonth: '', expirationYear: '', userId: '', isNew: true },
      ]);
      setRowModesModel((oldModel: any) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add card
        </Button>
      </GridToolbarContainer>
    );
}

export default function MainCards() {

    const { createCard, deleteCard, listCards, updateCard } = useContext(CardContext);
    const [  cardsRows, setCardsRows ] = useState<CardDataRow[]>([]);
    const [ rowModesModel, setRowModesModel ] = React.useState<GridRowModesModel>({});
    const Advice = withReactContent(Swal)

    useEffect(() => {
        const decodedToken = jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!);

        listCards
            .execute(decodedToken.id, localStorage.getItem("apiAuthToken")!)
            .then((response) => {
                setCardsRows(response.data.map((card) => {
                    return {
                        id: randomId(),
                        dataId: card.id,
                        cardType: card.cardType,
                        number: card.number,
                        dueDay: card.dueDay,
                        expirationMonth: card.expirationMonth,
                        expirationYear: card.expirationYear,
                        userId: card.userId,
                        isNew: false
                    }
                }));
            });
    }, []);

    const columns: GridColDef<(typeof cardsRows)[number]>[] = [
        {
            field: 'cardType',
            headerName: 'Type',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: getCardTypeValues(),
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
            field: 'dueDay',
            headerName: 'Due day',
            width: 150,
            type: 'number',
            editable: true,
            hideable: false,
        },
        {
            field: 'expirationMonth',
            headerName: 'Expiration month',
            width: 150,
            type: 'number',
            editable: true,
            hideable: false,
        },
        {
            field: 'expirationYear',
            headerName: 'Expiration year',
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
                const row = cardsRows.find((row) => row.id === id);

                deleteCard.execute(row!.dataId!, localStorage.getItem("apiAuthToken")!).then(() => {
                    setCardsRows(cardsRows.filter((row) => row.id !== id));
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
    
        const editedRow = cardsRows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setCardsRows(cardsRows.filter((row) => row.id !== id));
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
        const row = cardsRows.find((row) => row.id === newRow.id);

        const decodedToken = jwtDecode(localStorage.getItem("apiAuthToken")!);
        const updatedRow = { ...newRow, isNew: false };

        try {
            if (row!.isNew) {
                const card: Card = {
                    cardType: newRow.cardType,
                    number: newRow.number,
                    dueDay: newRow.dueDay,
                    expirationMonth: newRow.expirationMonth,
                    expirationYear: newRow.expirationYear,
                    userId: decodedToken.id
                };
                await createCard.execute(card, localStorage.getItem("apiAuthToken")!);
            } else {
                const card: Card = {
                    id: newRow.dataId,
                    cardType: newRow.cardType,
                    number: newRow.number,
                    dueDay: newRow.dueDay,
                    expirationMonth: newRow.expirationMonth,
                    expirationYear: newRow.expirationYear,
                    userId: decodedToken.id
                };
                await updateCard.execute(card, localStorage.getItem("apiAuthToken")!);
            }
            setCardsRows(cardsRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
            return updatedRow;
        } catch {
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
            <MainBreadcumbs openedLink="Cards" />
            <DataGrid
                rows={cardsRows}
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
                    toolbar: { setCardsRows, setRowModesModel },
                  }}
            />
            </Box>
    )
}
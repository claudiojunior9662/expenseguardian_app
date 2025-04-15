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
import { InvestmentCategoryDataRow } from "@/modules/investment/entities/investment-category-data-row.entity";
import { InvestmentCategoryContext } from "@/modules/investment/infraestructure/investment-category.context";
import { InvestmentCategory } from "@/modules/investment/entities/investment-category.entity";

function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setInvestmentCategoriesRows, setRowModesModel } = props;
  
    const handleClick = () => {
      const id = randomId();
      setInvestmentCategoriesRows((oldRows) => [
        ...oldRows,
        { id, description: '', isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
      }));
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add category
        </Button>
      </GridToolbarContainer>
    );
}

export default function MainInvestmentCategories() {

    const { createInvestmentCategory, deleteInvestmentCategory, listInvestmentCategories, updateInvestmentCategory } = useContext(InvestmentCategoryContext);
    const [  investmentCategoriesRows, setInvestmentCategoriesRows ] = useState<InvestmentCategoryDataRow[]>([]);
    const [ rowModesModel, setRowModesModel ] = React.useState<GridRowModesModel>({});
    const Advice = withReactContent(Swal)

    useEffect(() => {
        const decodedToken = jwtDecode<{ id: number }>(localStorage.getItem("apiAuthToken")!);

        listInvestmentCategories
            .execute(decodedToken.id, localStorage.getItem("apiAuthToken")!)
            .then((response) => {
                setInvestmentCategoriesRows(response.data.map((investmentCategory) => {
                    return {
                        id: randomId(),
                        dataId: investmentCategory.id,
                        description: investmentCategory.description,
                        userId: investmentCategory.userId,
                        isNew: false
                    }
                }));
            });
    }, []);

    const columns: GridColDef<(typeof investmentCategoriesRows)[number]>[] = [
        {
            field: 'description',
            headerName: 'Description',
            width: 150,
            editable: true,
            hideable: false,
        },
        {field: 'actions', headerName: 'Actions', width: 150, hideable: false, renderCell: (params) => {
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
                const row = investmentCategoriesRows.find((row) => row.id === id);

                deleteInvestmentCategory.execute(row!.dataId!, localStorage.getItem("apiAuthToken")!).then(() => {
                    setInvestmentCategoriesRows(investmentCategoriesRows.filter((row) => row.id !== id));
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
    
        const editedRow = investmentCategoriesRows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setInvestmentCategoriesRows(investmentCategoriesRows.filter((row) => row.id !== id));
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

    const processRowUpdate = (newRow: GridRowModel) => {
        const row = investmentCategoriesRows.find((row) => row.id === newRow.id);

        const decodedToken = jwtDecode(localStorage.getItem("apiAuthToken")!);

        if (row!.isNew) {
            const investmentCategory: InvestmentCategory = {
                description: newRow.description,
                userId: decodedToken.id
            };

            createInvestmentCategory.execute(investmentCategory, localStorage.getItem("apiAuthToken")!).then(() => {
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
            const investmentCategory: InvestmentCategory = {
                id: newRow.dataId,
                description: newRow.description,
                userId: decodedToken.id
            };

            updateInvestmentCategory.execute(investmentCategory, localStorage.getItem("apiAuthToken")!).then(() => {
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
        setInvestmentCategoriesRows(investmentCategoriesRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    return (
        <Box sx={{ width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
            <MainBreadcumbs openedLink="Investment Categories" />
            <DataGrid
                rows={investmentCategoriesRows}
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
                    toolbar: { setInvestmentCategoriesRows, setRowModesModel },
                  }}
            />
            </Box>
    )
}
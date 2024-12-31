import { UserResumeResponseSpents } from '@/modules/main-page/entities/user-resume-response.entity';
import GetUserResumeService from '@/modules/main-page/services/get-user-resume.service';
import { formatCurrency } from '@/shared/utils';
import { Box, Card, styled } from '@mui/material';
import { BarChart, LineChart, LineSeriesType, PieValueType, useDrawingArea } from '@mui/x-charts';
import { DatasetElementType, MakeOptional } from '@mui/x-charts/internals';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';

export default function MainPage() {

    const getUserResumeService = new GetUserResumeService();
    const [ spentsChartData, setSpentsChartData ] = useState<MakeOptional<PieValueType, "id">[]>([]);
    const [ incomesOutcomesChartData, setIncomesOutcomesChartData ] = useState<MakeOptional<LineSeriesType, "type">[]>([]);
    const [ investmentsChartData, setInvestmentsChartData ] = useState<DatasetElementType<string | number | Date | null | undefined>[]>([]);
    const [ incomeValue, setIncomeValue ] = useState<number>(0);
    const [ outcomeValue, setOutcomeValue ] = useState<number>(0);
    const [ availableValue, setAvailableValue ] = useState<number>(0);

    useEffect(() => {
        getUserResumeService.execute(
            {
                initialDate: new Date('2024-01-01'),
                finalDate: new Date('2024-03-30'),
                userId: 1
            },
            localStorage.getItem('apiAuthToken')!
        ).then((response) => {
            setSpentsChartData(response.data.spents.map((spent: UserResumeResponseSpents) => {
                return {
                    value: spent.percentage,
                    label: spent.description
                }
            }));

            const incomes: LineSeriesType = {
                type: 'line',
                curve: 'natural',
                data: response.data.incomes.map((income) => {
                    return income.value;
                })
            };

            const outcomes: LineSeriesType = {
                type: 'line',
                curve: 'natural',
                data: response.data.outcomes.map((outcome) => {
                    return outcome.value;
                })
            };

            setIncomesOutcomesChartData([incomes, outcomes]);

            setInvestmentsChartData(response.data.investments.map((investment) => {
                return {
                    description: investment.description,
                    percentage: investment.percentage
                }
            }));

            setIncomeValue(response.data.totalIncomes);
            setOutcomeValue(response.data.totalOutcomes);
            setAvailableValue(response.data.available);
        });
    }, []);

    const StyledText = styled('text')(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fontSize: 20,
    }));

    const investmentChartSettings = {
        xAxis: [
            {
                label: 'percentage (%)',
            },
        ]
    };

    function valueFormatter(value: number | null) {
        return `${value}%`;
    }

    function PieCenterLabel({ children }: { children: React.ReactNode }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2}>
            {children}
            </StyledText>
        );
    }

    return(
        <Box sx={{ width: '100%', paddingLeft: '10px', paddingRight: '10px' }}>
            <Card id='resume-card' className='mb-3'>
                <p id='resume-card-title' className='font-bold p-2 text-lg'>Resume</p>
                <div className="flex flex-row">
                    <div className="basis-1/4 grow">
                        <PieChart series={[{ data: spentsChartData, innerRadius: 100 }]} resolveSizeBeforeRender={true}>
                            {spentsChartData.length > 0 ? <PieCenterLabel>Center label</PieCenterLabel> : null}
                        </PieChart>
                    </div>
                    <div className="basis-1/4 grow">
                        <LineChart series={ incomesOutcomesChartData } resolveSizeBeforeRender={true}
                        />
                    </div>
                    <div className="basis-1/4 grow">
                        <BarChart
                            dataset={investmentsChartData}
                            yAxis={[{ scaleType: 'band', dataKey: 'description' }]}
                            series={[{ dataKey: 'percentage', valueFormatter }]}
                            layout="horizontal"
                            {...investmentChartSettings}
                            resolveSizeBeforeRender={true}
                            height={300}
                        />
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="basis-1/4 grow flex justify-center">
                        <p className='font-bold p-2'>Spents</p>
                    </div>
                    <div className="basis-1/4 grow flex justify-center">
                        <p className='font-bold p-2'>Incomes x Outcomes</p>
                    </div>
                    <div className="basis-1/4 grow flex justify-center">
                        <p className='font-bold p-2'>Investments</p>
                    </div>
                </div>
            </Card>
            <div className="grid grid-cols-4 gap-4">
                <Card id='balance-card'>
                    <p id='balance-card-title' className='font-bold p-2 text-lg'>Balance</p>
                    <p id='balance-card-title' className='font-bold p-2'>{`Income: ${formatCurrency(incomeValue)}`}</p>
                    <p id='balance-card-title' className='font-bold p-2'>{`Outcome: ${formatCurrency(outcomeValue)}`}</p>
                    <p id='balance-card-title' className='font-bold p-2'>{`Available: ${formatCurrency(availableValue)}`}</p>
                </Card>
            </div>
        </Box>
    );
}
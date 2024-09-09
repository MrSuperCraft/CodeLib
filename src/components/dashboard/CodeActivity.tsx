"use client"

import { Bar, BarChart, Rectangle, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Separator } from "../ui/separator"

export default function CodeActivity({ data }: { data?: any }) {
    return (
        <Card className="max-w-full border-none shadow-none">
            <CardContent className="flex flex-col lg:flex-row items-baseline gap-4 p-4">
                <div className="flex-col">
                    <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-lg md:text-xl lg:text-2xl">Snippet Activity</CardTitle>
                        <CardDescription className="text-sm md:text-base lg:text-lg">
                            Over the last 7 days, you have written an average of 20 lines of code every day.
                        </CardDescription>
                    </CardHeader>

                    <div className="flex items-baseline ml-4 gap-1 text-3xl font-semibold lg:font-bold tabular-nums leading-none">
                        20
                        <span className="text-sm font-normal text-muted-foreground">
                            lines / day
                        </span>
                    </div>
                </div>
                <Separator orientation="horizontal" className="block lg:hidden w-full mx-auto h-1 rounded-md bg-black/60" />
                <Separator orientation="vertical" className="lg:block hidden w-1 h-24 my-auto rounded-md bg-black/60" />
                <div className="mx-auto my-auto flex justify-center items-center">
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "#478ad7",
                            },
                        }}
                        className="w-[200px] lg:w-[150px] max-h-32"
                    >
                        <BarChart
                            accessibilityLayer
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                            }}
                            data={[
                                {
                                    date: "2024-01-01",
                                    steps: 2000,
                                },
                                {
                                    date: "2024-01-02",
                                    steps: 2100,
                                },
                                {
                                    date: "2024-01-03",
                                    steps: 2200,
                                },
                                {
                                    date: "2024-01-04",
                                    steps: 1300,
                                },
                                {
                                    date: "2024-01-05",
                                    steps: 1400,
                                },
                                {
                                    date: "2024-01-06",
                                    steps: 2500,
                                },
                                {
                                    date: "2024-01-07",
                                    steps: 1600,
                                },
                                {
                                    date: "2024-01-08",
                                    steps: 1900,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={2}
                                fillOpacity={0.2}
                                activeIndex={7}
                                activeBar={<Rectangle fillOpacity={0.9} />}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                hide
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card >
    )
}

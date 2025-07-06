import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XIcon, GlobeIcon, PlusIcon } from 'lucide-react';
import { DataTable } from './DataTable';
import { MobileCardView } from './MobileCardView';
import { ColumnDef } from '@tanstack/react-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface DataTablePageProps<T> {
    title: string;
    data: T[];
    columns: ColumnDef<T>[];
    searchField?: keyof T;
    renderMobileCard: (item: T, index: number) => React.ReactNode;
    emptyState?: React.ReactNode;
    successMessage?: string | null;
    errorMessage?: string | null;
    onClearError?: () => void;
    onAddNew?: () => void;
    addButtonLabel?: string;
    showTimezone?: boolean;
    initialTimezone?: string;
    onTimezoneChange?: (timezone: string) => void;
}

// Common timezones for the timezone selector
const COMMON_TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'Pacific/Auckland'
];

export function DataTablePage<T>({
    title,
    data,
    columns,
    searchField,
    renderMobileCard,
    emptyState,
    successMessage,
    errorMessage,
    onClearError,
    onAddNew,
    addButtonLabel = 'Add New',
    showTimezone = false,
    initialTimezone = 'UTC',
    onTimezoneChange,
}: DataTablePageProps<T>) {
    const [filter, setFilter] = useState<string>('');
    const [timezone, setTimezone] = useState<string>(initialTimezone);
    const [timezoneOpen, setTimezoneOpen] = useState(false);

    const filteredData = useMemo(() => {
        if (!searchField || !filter) return data;

        return data.filter((item) => {
            const fieldValue = item[searchField];
            if (typeof fieldValue === 'string') {
                return fieldValue.toLowerCase().includes(filter.toLowerCase());
            }
            return false;
        });
    }, [data, filter, searchField]);

    // Handle timezone change
    const handleTimezoneChange = (value: string) => {
        setTimezone(value);
        setTimezoneOpen(false);
        if (onTimezoneChange) {
            onTimezoneChange(value);
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            {successMessage && (
                <div className="p-4">
                    <Alert className="relative bg-green-50 border-green-500 text-green-800">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                </div>
            )}

            {errorMessage && (
                <div className="p-4">
                    <Alert variant="destructive" className="relative">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                        {onClearError && (
                            <button
                                onClick={onClearError}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                                aria-label="Close error message"
                            >
                                <XIcon className="h-4 w-4" />
                            </button>
                        )}
                    </Alert>
                </div>
            )}

            <Card className="rounded-2xl shadow p-4 grid gap-4">
                <CardHeader className="p-4">
                    <div className="flex flex-col gap-4">
                        {/* Title row */}
                        <div>
                            <h1 className="text-xl font-bold">{title}</h1>
                        </div>

                        {/* Second row with timezone on left, search and add button on right */}
                        <div className="flex justify-between items-center">
                            {/* Left side - Timezone */}
                            <div>
                                {showTimezone && (
                                    <Popover open={timezoneOpen} onOpenChange={setTimezoneOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1 text-xs"
                                            >
                                                <GlobeIcon className="h-3 w-3" />
                                                <span className="max-w-[180px] truncate">{timezone}</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-[300px]" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search timezone..." />
                                                <CommandEmpty>No timezone found.</CommandEmpty>
                                                <CommandGroup className="max-h-[300px] overflow-auto">
                                                    {COMMON_TIMEZONES.map((tz) => (
                                                        <CommandItem
                                                            key={tz}
                                                            value={tz}
                                                            onSelect={handleTimezoneChange}
                                                            className="cursor-pointer"
                                                        >
                                                            {tz}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>

                            {/* Right side - Search and Add button */}
                            <div className="flex gap-2 items-center">
                                {searchField && (
                                    <Input
                                        placeholder={`Search ${title.toLowerCase()}...`}
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="max-w-sm"
                                    />
                                )}
                                {onAddNew && (
                                    <Button
                                        onClick={onAddNew}
                                        size="sm"
                                        className="whitespace-nowrap"
                                    >
                                        <PlusIcon className="h-4 w-4 mr-1" />
                                        {addButtonLabel}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                {/* Mobile view */}
                <div className="md:hidden">
                    <MobileCardView
                        data={filteredData}
                        renderCard={renderMobileCard}
                        emptyState={emptyState}
                    />
                </div>

                {/* Desktop view */}
                <CardContent className="hidden md:block">
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        emptyState={emptyState}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

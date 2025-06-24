import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO, isToday, isThisMonth, differenceInMinutes } from 'date-fns';
import { enUS } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const useVisitorData = () => {
    const { toast } = useToast();
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        const storedVisitors = JSON.parse(localStorage.getItem('visitors')) || [];
        setVisitors(storedVisitors.sort((a, b) => parseISO(b.inTime) - parseISO(a.inTime)));
    }, []);

    const updateLocalStorageAndState = (updatedVisitors) => {
        localStorage.setItem('visitors', JSON.stringify(updatedVisitors));
        setVisitors(updatedVisitors.sort((a, b) => parseISO(b.inTime) - parseISO(a.inTime)));
    };

    const handleDelete = (visitorId) => {
        const updatedVisitors = visitors.filter(v => v.id !== visitorId);
        updateLocalStorageAndState(updatedVisitors);
        toast({
            title: "Deleted",
            description: "Visitor information has been successfully deleted.",
        });
    };

    const handleCheckout = (visitorId) => {
        const updatedVisitors = visitors.map(v =>
            v.id === visitorId ? {...v, outTime: new Date().toISOString() } : v
        );
        updateLocalStorageAndState(updatedVisitors);
        toast({
            title: "Checked Out",
            description: "Visitor's checkout time has been recorded.",
        });
    };

    const handleUpdateVisitor = (updatedVisitorData) => {
        const updatedVisitors = visitors.map(v =>
            v.id === updatedVisitorData.id ? updatedVisitorData : v
        );
        updateLocalStorageAndState(updatedVisitors);
        toast({
            title: "Update Successful",
            description: "Visitor information has been successfully updated.",
        });
    };

    const formatTime = (isoString) => {
        if (!isoString) return '-';
        return format(parseISO(isoString), 'PPpp', { locale: enUS });
    };

    const calculateDuration = (inTime, outTime) => {
        if (!inTime || !outTime) return '-';
        const durationMinutes = differenceInMinutes(parseISO(outTime), parseISO(inTime));
        if (durationMinutes < 1) return '< 1 minute';
        if (durationMinutes < 60) return `${durationMinutes} minute${durationMinutes === 1 ? '' : 's'}`;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        let durationString = `${hours} hour${hours === 1 ? '' : 's'}`;
        if (minutes > 0) {
            durationString += ` ${minutes} minute${minutes === 1 ? '' : 's'}`;
        }
        return durationString;
    };

    // Update exportToExcel to include Duration in Excel export
    const exportToExcel = (dataToExport, fileName) => {
        if (!dataToExport || dataToExport.length === 0) {
            toast({
                variant: "destructive",
                title: "No Data",
                description: "No visitor data found to export.",
            });
            return;
        }

        // Prepare data for export, including Card No and Duration
        const headers = [
            'Card No',
            'Name',
            'Phone',
            'Company',
            'To Meet',
            'Purpose',
            'In Time',
            'Out Time',
            'Duration'
            // add more fields if needed
        ];

        // You must have a calculateDuration function available here
        const calculateDuration = (inTime, outTime) => {
            if (!inTime || !outTime) return '';
            const start = new Date(inTime);
            const end = new Date(outTime);
            const ms = end - start;
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            return `${hours}h ${minutes}m`;
        };

        const rows = dataToExport.map(v => [
            v.cardNo || '',
            v.name || '',
            v.phone || '',
            v.companyName || '',
            v.toMeet || '',
            v.purpose || '',
            v.inTime || '',
            v.outTime || '',
            v.inTime && v.outTime ? calculateDuration(v.inTime, v.outTime) : ''
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Visitor List");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blobData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        saveAs(blobData, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
        toast({
            title: "Export Successful",
            description: `${fileName}.xlsx file has been downloaded.`
        });
    };

    return {
        visitors,
        handleDelete,
        handleCheckout,
        handleUpdateVisitor,
        formatTime,
        calculateDuration,
        exportToExcel,
    };
};

export default useVisitorData;
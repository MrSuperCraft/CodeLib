import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sun, Moon, CloudSun, Sunset, ChevronDown, ChevronUp, Laptop, Tablet, Watch, Globe, SmartphoneIcon } from 'lucide-react'; // Import icons
import { getRecentLogins } from '@/actions/get-recent-logins';
import { getUserAgentDetails } from '@/lib/userAgent';
import { Separator } from '../ui/separator';

const platformIcons: { [key: string]: JSX.Element } = {
    Windows: <Laptop className="w-6 h-6 text-black bg-white" />,
    Mac: <Laptop className="w-6 h-6 text-black bg-white" />,
    Linux: <Laptop className="w-6 h-6 text-black bg-white" />,
    iPhone: <SmartphoneIcon className="w-6 h-6 text-black bg-white" />,
    Android: <SmartphoneIcon className="w-6 h-6 text-black bg-white" />,
    Tablet: <Tablet className="w-6 h-6 text-black bg-white" />,
    Smartwatch: <Watch className="w-6 h-6 text-black bg-white" />,
    default: <Globe className="w-6 h-6 text-black bg-white" /> // Default icon
};

const ActivityLog = ({ email }: { email: string }) => {
    const [logEntries, setLogEntries] = useState<any[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const getLogs = useCallback(async () => {
        if (!email) return;
        const logs = await getRecentLogins(email);
        setLogEntries(
            logs.map((log: any) => ({
                device: log.device,
                platform: log.platform,
                time: new Date(log.timestamp).toLocaleString(),
                icon: getDeviceIcon(new Date(log.timestamp)),
                userAgentDetails: getUserAgentDetails(log.userAgent), // Add user agent details
            }))
        );
    }, [email]);

    useEffect(() => {
        const controller = new AbortController();

        getLogs();

        return () => controller.abort(); // Cleanup if the component unmounts
    }, [getLogs]);

    const getDeviceIcon = (date: Date) => {
        const hour = date.getHours();
        if (hour >= 0 && hour < 5) return <Moon className="w-6 h-6 text-black bg-white rounded-full" />;
        if (hour >= 5 && hour < 12) return <Sun className="w-6 h-6 text-black bg-white rounded-full" />;
        if (hour >= 12 && hour < 16) return <CloudSun className="w-6 h-6 text-black bg-white rounded-full" />;
        if (hour >= 16 && hour < 20) return <Sunset className="w-6 h-6 text-black bg-white rounded-full" />;
        return <Moon className="w-6 h-6 text-black  bg-white rounded-full" />;
    };

    const handleToggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getPlatformIcon = (platform: string): JSX.Element => {
        // Check for specific keywords in the platform string
        if (platform.includes('Windows')) return platformIcons.Windows;
        if (platform.includes('Mac')) return platformIcons.Mac;
        if (platform.includes('Linux')) return platformIcons.Linux;
        if (platform.includes('iPhone')) return platformIcons.iPhone;
        if (platform.includes('Android')) return platformIcons.Android;
        if (platform.includes('Tablet')) return platformIcons.Tablet;
        if (platform.includes('Smartwatch')) return platformIcons.Smartwatch;
        return platformIcons.default;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>View Activity</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Activity Log</DialogTitle>
                    <DialogDescription>Check your recent login activity.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {logEntries.length != 0 ? (
                        logEntries.map((entry, index) => (
                            <div key={index} className="flex flex-col py-2">
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <div className={`size-10 flex items-center justify-center bg-white  rounded-full border border-black text-black`}>
                                            {entry.icon}
                                        </div>
                                        <div className='flex flex-col ml-4'>
                                            <div className="text-gray-900">{entry.device}</div>
                                            <div className="text-gray-600">{entry.time}</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-2 items-center'>
                                        <div>{getPlatformIcon(entry.platform)}</div>
                                        <Button
                                            variant="outline"
                                            className="ml-4"
                                            onClick={() => handleToggle(index)}
                                        >
                                            {expandedIndex === index ? <ChevronUp /> : <ChevronDown />}
                                        </Button>
                                    </div>
                                </div>

                                {expandedIndex === index && (

                                    <div className="mt-2 ml-12 text-gray-700">
                                        <Separator className='my-auto' />
                                        <div><strong>Platform:</strong> {entry.userAgentDetails.platform}</div>
                                        <div><strong>Browser:</strong> {entry.userAgentDetails.browser}</div>
                                        <div><strong>Device:</strong> {entry.userAgentDetails.device || entry.userAgentDetails.os}</div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : <div className="text-gray-900 dark:text-white">It seems like you have no activity here. How interesting is that?
                        <br />
                        Oh, it&apos;s not monitored yet on OAuth logins. Be sure to hit your notification bells on for a new update about that!
                    </div>

                    }
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ActivityLog;

'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { deleteAccount } from '@/lib/SaveSettings';
import useSettingsStore from '@/app/store/SettingsStore';
import { useSession, signOut } from 'next-auth/react';
import ActivityLog from '@/components/settings/ActivityLog';
import { useTheme } from 'next-themes';
import { LanguageCombobox } from '@/components/settings/LanguageComboBox';
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner';

export default function Settings() {
    const {
        email,
        darkMode,
        language,
        setSettings,
    } = useSettingsStore(state => ({
        email: state.email,
        darkMode: state.darkMode,
        language: state.language,
        setSettings: state.setSettings
    }));

    const { data: session } = useSession();
    const id = session?.user?.id;
    const sessionEmail = session?.user?.email;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (session) {
            setSettings({ email: session?.user?.email || '' });
        }
    }, [session, setSettings]);

    const { theme, setTheme } = useTheme();

    const switchTheme = (theme: string | undefined) => {
        switch (theme) {
            case 'light':
                setTheme('dark');
                break;
            case 'dark':
                setTheme('light');
                break;
            default:
                setTheme('system');
                break;
        }
    };

    const handleChangePassword = async () => {
        if (!id || newPassword === '') {
            toast.error("Error: ID not found / empty password")
        }
        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                toast.success('Password updated successfully');
            } else {
                throw new Error(data.error || 'Failed to update password');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error((error as unknown as Error).message || 'An error occurred');
        }
    };

    const handleLanguageChange = (language: string) => {
        setSettings({ language });
    };


    const handleAccountDeletion = async () => {
        if (session) {
            if (!id || !sessionEmail) {
                toast.error('Deletion failed. Try again later');
                return;
            }
            try {
                await deleteAccount(id, sessionEmail);
                await signOut();
                toast.success('Account deleted successfully!');
            } catch (error) {
                toast.error('Deletion failed. Try again later');
            }
            setIsDialogOpen(false); // Close the dialog after deletion
        }
    };

    const handleRequestData = async () => {
        try {
            setIsExporting(true);
            // API call to fetch user data
            const response = await fetch(`/api/export-data?email=${email}&id=${id}`);
            const data = await response.json();

            if (response.ok) {
                // Create a downloadable file (JSON format)
                const fileData = JSON.stringify(data, null, 2);
                const blob = new Blob([fileData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                // Create a download link and trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = `${email}-data.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success('Your data has been exported successfully.');
            } else {
                throw new Error('Failed to export data');
            }
        } catch (error) {
            toast.error('Error exporting data. Please try again later.');
        } finally {
            setIsExporting(false);
            setIsDialogOpen(false);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleDataDialogClose = () => {
        setIsDataDialogOpen(false);
    }


    return (
        <div className="container mx-auto p-6 transition-all duration-200">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            {/* Account Settings */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account details. Only available for users with credentials.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium mb-2">Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setSettings({ email: e.target.value })}
                            placeholder="Enter your email"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium mb-2">New Password</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className="w-full"
                        />
                    </div>
                    <Button onClick={handleChangePassword}>Update Password</Button>
                </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>Customize the look and feel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Dark Mode</Label>
                        <Switch checked={darkMode} onCheckedChange={(checked) => { setSettings({ darkMode: checked }); switchTheme(theme); }} />
                    </div>
                </CardContent>
            </Card>


            {/* Security Settings */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Recent Login Activity</Label>
                        <ActivityLog email={session?.user?.email || ''} />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Privacy & Data</Label>
                        {/* Request Data Dialog */}
                        <Dialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
                            <DialogTrigger>
                                <Button>Request Data</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Request Your Data</DialogTitle>
                                    <DialogDescription>
                                        Do you want to export all your data? This may include personal information, activity logs, and preferences.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <Button
                                        onClick={handleRequestData}
                                        disabled={isExporting}
                                        className="w-full"
                                    >
                                        {isExporting ? 'Exporting...' : 'Confirm and Export Data'}
                                    </Button>
                                    <Button variant="secondary" onClick={handleDataDialogClose} className="w-full">
                                        Cancel
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>


            {/* Miscellaneous */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Miscellaneous</CardTitle>
                    <CardDescription>Other settings and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <Label className="text-sm font-medium text-left">Language</Label>
                        <p className="text-xs text-gray-700 dark:text-white">Full language support is coming soon.</p>
                        <LanguageCombobox currentLanguage={language} onLanguageChange={handleLanguageChange} />
                    </div>
                    <div className="flex flex-col w-[150px]">
                        <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? This action cannot be undone, and will remove all of your data from CodeLib.

                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex justify-center space-x-4">
                        <Button variant="destructive" onClick={handleAccountDeletion}>
                            Delete
                        </Button>
                        <Button variant="outline" onClick={handleDialogClose}>
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardNavbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="text-2xl font-bold">CodeLib</div>
            <div className="flex items-center space-x-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-700 text-white"
                />
                <div className="flex space-x-3">
                    <Button variant="ghost" aria-label="Notifications">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </Button>
                    <Button variant="ghost" aria-label="Messages">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405a2.032 2.032 0 00-.926-.522A2.032 2.032 0 0118 14V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 001.405 1.9c.254.105.513.169.783.183H15v3z"
                            />
                        </svg>
                    </Button>
                </div>
                <Avatar>
                    <AvatarImage src="https://via.placeholder.com/40" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
}

import { NextRequest, NextResponse } from 'next/server';
import { changePassword } from '@/actions/change-password';

export async function POST(req: NextRequest) {
    try {
        const { id, newPassword } = await req.json();

        if (!id || !newPassword) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // Call the server-side action to change the password
        await changePassword(id, newPassword);

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

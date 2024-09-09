import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '@/actions/get-user-data';  // Assuming this is where your getUserData function is stored

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    // Extract 'email' and 'id' from the search parameters
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    // Validate that both 'email' and 'id' are provided
    if (!email || !id) {
        return NextResponse.json({ error: 'Email and ID are required' }, { status: 400 });
    }

    try {
        // Call the getUserData function to fetch all the necessary data
        const userData = await getUserData(id, email);

        // Return the data as a JSON response
        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);

        // Return an error response in case of failure
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}

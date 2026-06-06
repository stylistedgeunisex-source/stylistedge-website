import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Path to public/database.json
    const filePath = path.join(process.cwd(), 'public', 'database.json');
    
    // Write the new data
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Database saved successfully' });
  } catch (error) {
    console.error('Error saving database:', error);
    return NextResponse.json({ success: false, message: 'Failed to save database' }, { status: 500 });
  }
}

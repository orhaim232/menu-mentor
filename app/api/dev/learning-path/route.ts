// TEMPORARY DEVELOPMENT ENDPOINT
// This route is for testing the AI learning path generation only.
// It should not be used in production.

import { NextResponse } from 'next/server';
import { generateLearningPathWithAI } from '../../../../lib/ai/learningPath';
import { MOCK_RESTAURANT, MOCK_MENU_ITEMS, MOCK_TAGS } from '../../../../lib/db/mockData';

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET() {
  // Security check: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    // Generate the learning path using the mock data
    const learningPath = await generateLearningPathWithAI(
      MOCK_RESTAURANT,
      MOCK_MENU_ITEMS,
      MOCK_TAGS
    );

    return NextResponse.json({
      success: true,
      message: 'Learning path generated successfully. Note: Check server console to see if fallback was used due to missing API key.',
      data: learningPath,
    });
  } catch (error) {
    console.error('Error in dev learning path route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate learning path' },
      { status: 500 }
    );
  }
}
